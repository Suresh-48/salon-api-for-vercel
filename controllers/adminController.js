import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import { USER_ROLE_ADMIN } from "../constants/roles.js";
import { deleteOne, getAll } from "./baseController.js";
import { Storage } from "@google-cloud/storage";

export async function createAdmin(req, res, next) {
  try {
    const data = req.body;
    const existData = await Admin.find({ mobileNumber: data.mobileNumber });
    if (existData.length === 0) {
      //Google Key
      const storage = new Storage({
        keyFilename: `./saloonapp.json`,
      });
      const timeStamp = new Date().toISOString().replace(/[-:TZ.]/g, "");
      const bucketName = "kharphi-image";
      const bucket = storage.bucket(bucketName);
      const base64Image = data.image.split(";base64,").pop();
      const fileContent = Buffer.from(base64Image, "base64");
      const file = bucket.file(timeStamp + "/" + data.fileName);
      const stream = file.createWriteStream({
        metadata: {
          contentType: "image/jpeg",
        },
      });
      stream.on("error", (error) => {
        console.error("Error uploading image:", error);
        res.status(500).send("Error uploading image");
      });
      stream.on("finish", () => {
        console.log("image upload finish");
      });
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${timeStamp}/${data.fileName}`;
      stream.end(fileContent);

      const createData = await Admin.create({
        name: data.name,
        email: data.email,
        shopName: data.shopName,
        shopRegisterNumber: data.shopRegisterNumber,
        shopAddress: data.shopAddress,
        logo: publicUrl,
        gstNumber: data.gstNumber,
        shopCity: data.shopCity,
        shopPincode: data.shopPincode,
        mobileNumber: data.mobileNumber,
      });
      const randomId = Math.random().toString(30).substring(2, 10) + Math.random().toString(30).substring(2, 10);
      const createUser = await User.create({
        name: data.name,
        email: data.email,
        mobileNumber: data.mobileNumber,
        role: USER_ROLE_ADMIN,
        sessionId: randomId,
        fcmToken: data.fcmToken,
        adminId: createData._id,
      });
      res.status(201).json({
        message: "Shop Details Created Successfully",
        createData,
      });
    } else {
      res.status(208).json({
        message: "Data Already Exist",
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function updateAdminDetails(req, res, next) {
  try {
    const id = req.params.id;

    const data = req.body;
    if (data.fileName) {
      const timeStamp = new Date().toISOString().replace(/[-:TZ.]/g, "");
      const storage = new Storage({
        keyFilename: `./saloonapp.json`,
      });

      const bucketName = "kharphi-image";
      const bucket = storage.bucket(bucketName);
      const base64Image = data.image.split(";base64,").pop();
      const fileContent = Buffer.from(base64Image, "base64");
      const file = bucket.file(timeStamp + "/" + data.fileName);

      const stream = file.createWriteStream({
        metadata: {
          contentType: "image/jpeg",
        },
      });
      stream.on("error", (error) => {
        console.error("Error uploading image:", error);
        res.status(500).send("Error uploading image");
      });
      stream.on("finish", () => {
        // file.makePublic((error) => {
        //   if (error) {
        //     console.error('Error making file public:', error);
        //     res.status(500).send('Error making file public');
        //   } else {
        //     const publicUrl = `https://storage.googleapis.com/${bucketName}/${file.name}`;
        //     res.send({ publicUrl });
        //   }
        // });
      });

      const publicUrl = `https://storage.googleapis.com/${bucketName}/${timeStamp}/${data.fileName}`;

      stream.end(fileContent);
      const editData = {
        name: data.name,
        email: data.email,
        shopName: data.shopName,
        shopRegisterNumber: data.shopRegisterNumber,
        shopAddress: data.shopAddress,
        logo: publicUrl,
        gstNumber: data.gstNumber,
        shopCity: data.shopCity,
        shopPincode: data.shopPincode,
        mobileNumber: data.mobileNumber,
      };
      const updateData = await Admin.findByIdAndUpdate(id, editData, {
        new: true,
        runValidators: true,
      });

      const editUserData = {
        name: data.name,
        email: data.email,
        mobileNumber: data.mobileNumber,
      };

      const userId = await User.findOne({ adminId: id });

      const updateUserData = await User.findByIdAndUpdate(userId.id, editUserData, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        message: "Offer details updated successfully",
        updateData,
      });
    } else {
      const editData = {
        name: data.name,
        email: data.email,
        shopName: data.shopName,
        shopRegisterNumber: data.shopRegisterNumber,
        shopAddress: data.shopAddress,
        gstNumber: data.gstNumber,
        shopCity: data.shopCity,
        shopPincode: data.shopPincode,
      };

      const updateData = await Admin.findByIdAndUpdate(id, editData, {
        new: true,
        runValidators: true,
      });

      const userId = await User.findOne({ adminId: id });
      const editUserData = {
        name: data.name,
        email: data.email,
        mobileNumber: data.mobileNumber,
      };

      const updateUserData = await User.findByIdAndUpdate(userId?._id, editUserData, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        message: "Admin details updated successfully",
        updateData,
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getAdminDetails(req, res, next) {
  try {
    const userId = req.params.id;
    const data = await User.findOne({ _id: userId }).populate("adminId");

    res.status(200).json({
      message: "Get admin details successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdminShopDetails(req, res, next) {
  try {
    const adminId = req.params.id;
    const data = await Admin.findOne({ _id: adminId });

    res.status(200).json({
      message: "Get admin shop details successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export const getAllAdmin = getAll(Admin);

export const deleteAdminDetails = deleteOne(User);
