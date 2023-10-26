import appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./baseController.js";
import Device from "../models/deviceDetailsModel.js";

// export const userCreate = createOne(User);
export const userUpdate = updateOne(User);
export const getAllUser = getAll(User);
export const getOneUser = getOne(User);
export const userDelete = deleteOne(User);

export async function Login(req, res, next) {
  try {
    const data = req.body;
    const randomId = Math.random().toString(30).substring(2, 10) + Math.random().toString(30).substring(2, 10);
    const user = await User.findOne({ mobileNumber: data.mobileNumber });
    if (user) {
      const userLogin = await User.findById(user?._id);

      const updateToken = await User.findByIdAndUpdate(
        { _id: user?._id },
        {
          sessionId: randomId,
          fcmToken: data.fcmToken,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        status: "Success",
        message: "Login Successfully",
        userLogin,
      });
    } else {
      res.status(400).json({
        status: "Bad request",
        message: "Invalid Credential",
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function userCreate(req, res, next) {
  try {
    const data = req.body;

    const existUser = await User.find({ mobileNumber: data.mobileNumber });
    const randomId = Math.random().toString(30).substring(2, 10) + Math.random().toString(30).substring(2, 10);
    if (existUser.length === 0) {
      const createUser = await User.create({
        name: data.name,
        email: data.email,
        mobileNumber: data.mobileNumber,
        role: data.role,
        sessionId: randomId,
        fcmToken: data.fcmToken,
      });

      res.status(201).json({
        status: "Created",
        message: "User Created",
        createUser,
      });
    } else {
      res.status(208).json({
        message: "User Already Exist",
        existUser,
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function OTPVerification(req, res, next) {
  try {
    const userId = req.params.id;
    const Otpverify = await User.findById(userId);

    res.status(200).json({
      status: "success",
      message: "OTP Verfied Success",
      Otpverify,
    });
  } catch (err) {
    next(err);
  }
}
export async function AddShopId(req, res, next) {
  try {
    const phoneNum = req.params.id;
    const data = req.body;
    const updateShopId = await User.findOne({ mobileNumber: phoneNum });
    const datas = await User.findByIdAndUpdate(
      updateShopId?.id,
      { shopId: data.shopId },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: "success",
      message: "ShopId Updated Successfully",
      datas,
    });
  } catch (err) {
    console.log("err", err);
  }
}

export async function findUserList(req, res, next) {
  try {
    const phNumber = req.query.mobileNumber;

    const findUser = await User.findOne({ mobileNumber: phNumber });

    if (findUser) {
      res.status(201).json({
        status: "Success",
        findUser,
      });
    } else {
      res.status(404).json({
        status: "User Not Foundy",
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getUserShopList(req, res, next){
  try{

    const userIds = req.params.id;

    const userData = await appointment.find({ userId: userIds })
      .populate('userId')
      .populate('shopId')
      .populate('productId');

    const uniqueShopIds = {};

    // Filter out duplicates based on shopId
    const data = userData.filter((item) => {
      if (!uniqueShopIds[item.shopId]) {
        uniqueShopIds[item.shopId] = true;
        return true;
      }
      return false;
    });
    res.status(201).json({
      message: "Get User Shop List Details",
      data,
    })

  }catch(err){
    next(err);
  }
}
export async function createOtpData(req, res, next){
  try{
    const data = req.body;
    const deviceUiId = data.otpData._auth._user.uid
    const existData = await Device.find({
      deviceId: deviceUiId
    });
    if(existData.length == 0){
      const createData = await Device.create({
        deviceData:data.otpData._auth,
        deviceId: data.otpData._auth._user.uid,
        phoneNumber:data.otpData._auth._user.phoneNumber,
      });

      res.status(201).json({
        message: "Device Id Created Successfully",
        createData,
      })
    }else{
      res.status(201).json({
        message: "Device Id Already Created Successfully",
        existData,
      })
    }

   

  }catch(err){
    next(err);
  }
}