import Category from "../models/categoryModel.js";
import { createOne, updateOne, getAll, getOne, deleteOne } from "./baseController.js";
import { Storage } from "@google-cloud/storage";
// export const categoryCreate = createOne(Category);
// export const categoryUpdate = updateOne(Category);
// export const categoryGetAll = getAll(Category);
export const categoryGetOne = getOne(Category);
export const categoryDelete = deleteOne(Category);

export async function categoryGetAll(req, res, next) {
  try {
    const data = await Category.find({ shopId: req.query.shopId });
    res.status(200).json({
      status: "success",
      message: "Category details fetched successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function categoryCreate(req, res, next) {
  try {
    const data = req.body;
    const Product = await Category.find({ categoryName: data.categoryName, shopId: data.shopId });
    if (Product.length === 0) {
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
      const fileds = { image: publicUrl, categoryName: data.categoryName, shopId: data.shopId };
      const createCategroy = await Category.create(fileds);
      res.status(201).json({
        status: "Success",
        message: "Category created successfully",
        createCategroy,
      });
    } else {
      res.status(404).json({
        status: "failed",
        message: "Product Already Exist",
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function categoryUpdate(req, res, next) {
  try {
    const categoryId = req.params.id;
    const data = req.body;
    const timeStamp = new Date().toISOString().replace(/[-:TZ.]/g, "");
    if (data.fileName) {
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

      const fileds = { image: publicUrl, categoryName: data.categoryName };
      const updateCategory = await Category.findByIdAndUpdate(categoryId, fileds, {
        new: true,
        runValidators: true,
      });
      res.status(201).json({
        status: "Success",
        message: "Category Edited Successfully",
        updateCategory,
      });
    } else {
      const updateCategory = await Category.findByIdAndUpdate(categoryId, data, { new: true, runValidators: true });
      res.status(200).json({
        status: "success",
        message: "Category Updated Successfully",
        updateCategory,
      });
    }
  } catch (err) {
    next(err);
    console.log("err", err);
  }
}
