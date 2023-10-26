import appointment from "../models/appointmentModel.js";
import moment from "moment-timezone";
import User from "../models/userModel.js";
import sendNotification from "../notification.js";
import { deleteOne } from "../controllers/baseController.js";

export async function createAppointment(req, res, next) {
  try {
    const data = req.body;

    const existData = await appointment.find({
      $and: [{ date: data.date }, { userId: data.userId }, { time: data.time }],
      shopId: data.shopId,
    });

    const adminData = await User.findOne({ role: "admin" });
    const userData = await User.findById(data.userId);

    let date = new Date();

    const dateParts = data.date.split("-");
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Month is zero-based (0-11)
    const year = parseInt(dateParts[2], 10);

    let bookingDate = new Date(year, month, day);

    const timeStamp = moment(date).utc().format();

    const timeZone = "Asia/Kolkata";
    const localTimestamp = moment().tz(timeZone);

    if (existData.length === 0) {
      const createData = await appointment.create({
        userId: data.userId,
        productId: data.productId,
        date: data.date,
        time: data.time,
        timeStamp: timeStamp,
        bookingDate: bookingDate,
        shopId: data.shopId,
        createdAt: localTimestamp.format(),
      });

      const message = `Hello Admin, ${userData.name} has been booked for a time slot at ${createData.time} on the ${createData.date} `;

      const fcmToken = adminData.fcmToken;

      sendNotification(fcmToken, message);

      res.status(201).json({
        message: "Appointment Successfully",
        createData,
      });
    } else {
      res.status(208).json({
        message: "Already appointment created",
        existData,
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getMyBooking(req, res, next) {
  try {
    const userData = req.query;

    const data = await appointment
      .find({ userId: userData.userId, shopId: userData.shopId })
      .populate("userId")
      .populate("productId");

    res.status(200).json({
      message: "Get customer booking details",
      data,
    });
  } catch (err) {
    next(err);
  }
}
export async function getAdminBooking(req, res, next) {
  try {
    const data = await appointment.find({ shopId: req.query.shopId }).populate("userId").populate("productId");

    res.status(200).json({
      message: "Get admin booking details",
      data,
    });
  } catch (err) {
    next(err);
  }
}
export async function checkAppointment(req, res, next) {
  try {
    const data = req.query;
    const datas = await appointment.find({ date: data.date, shopId: data.shopId });

    const currentTime = moment(); // Define currentTime here

    let givenTime; // Define givenTime here

    const currentDate = moment().startOf("day");
    const givenDateStr = data.date;
    const givenDate = moment(givenDateStr, "DD-MM-YYYY");
    const tomorrow = moment().add(1, "days").startOf("day");
    const isTomorrow = moment(data.date, "DD-MM-YYYY").isSame(tomorrow, "day");
    const newDate = isTomorrow ? "Tomorrow" : givenDate.isSame(currentDate) ? "Today" : data.date;

    if (datas.length > 0) {
      // ... (existing code)
      const givenTimeStr = data.time;
      const givenTimeFormat = "h:mm A"; // Adjust the format based on your time string
      givenTime = moment(givenTimeStr, givenTimeFormat);

      const timeLeft = givenTime.diff(currentTime, "minutes");

      // ... (existing code)

      const time = timeLeft > 0 && currentDate ? givenTimeStr : currentTime.format("h:mm A"); // Use currentTime here

      res.status(200).json({
        message: `Your Time is ${time} on ${newDate}`,
        data: {
          time,
        },
      });
    } else {
      // ... (existing code)

      const givenTimeStr = data.time;
      const givenTimeFormat = "h:mm A"; // Adjust the format based on your time string
      givenTime = moment(givenTimeStr, givenTimeFormat);

      const timeLeft = givenTime.diff(currentTime, "minutes");

      // ... (existing code)

      const time = timeLeft > 0 ? givenTimeStr : givenTimeStr; // Use currentTime here

      res.status(200).json({
        message: `Your Time is ${time} on ${newDate}`,
        data: {
          time,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function DateFilter(req, res, next) {
  try {
    const data = req.query;
    const fromDate = new Date(data.fromDate);
    const toDate = new Date(data.toDate);
    // toDate.setDate(toDate.getDate() + 1);

    const filterData = await appointment
      .find({
        $or: [
          {
            $and: [{ bookingDate: { $gte: fromDate } }, { bookingDate: { $lte: toDate } }],
          },
        ],
        shopId: req.query.shopId,
      })
      .populate("userId")
      .populate("productId");

    res.status(200).json({
      status: "success",
      message: "success",
      filterData,
    });
  } catch (err) {
    next(err);
    console.log("err", err);
  }
}

export async function UserAppointmentList(req, res, next) {
  try {
    const userId = req.params.id;
    const data = await appointment.find({ userId: userId, shopId: req.query.shopId }).sort({ $natural: -1 });
    res.status(200).json({
      status: "success",
      message: "User Appoinment list",
      data,
    });
  } catch (err) {
    console.log("err", err);
    next(err);
  }
}

export async function UserBasedDateFilter(req, res, next) {
  try {
    const data = req.query;
    const userId = req.params.id;
    const fromData = new Date(data.fromDate);
    const toDate = new Date(data.toDate);
    const filterData = await appointment
      .find({ userId: userId, bookingDate: { $gte: fromData, $lte: toDate }, shopId: req.query.shopId })
      .populate("productId")
      .sort({ $natural: -1 });

    let totalAmount = 0;
    filterData.forEach((item) => {
      totalAmount += item.productId.totalAmount;
    });
    res.status(200).json({
      status: "Success",
      message: "User Details Filtered Successfully",
      filterData,
      totalAmount,
    });
  } catch (err) {
    next(err);
  }
}

export const cancelAppointment = deleteOne(appointment);
