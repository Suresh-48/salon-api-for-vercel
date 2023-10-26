import Product from "../models/productModel.js";
import { createOne, updateOne, getAll, getOne, deleteOne } from "./baseController.js";
import { uploadImageToStorage } from "../utils/uploadImageToStorage.js";
import { Storage } from "@google-cloud/storage";

import moment from "moment-timezone";

// export const productCreate = createOne(Product);
// export const productUpdate = updateOne(Product);
export const productGetAll = getAll(Product);
// export const productGetOne = getOne(Product);
export const productDelete = deleteOne(Product);

export async function productGetOne(req, res, next) {
  try {
    const data = await Product.find({ shopId: req.query.shopId });
    res.status(200).json({
      message: "Get all products",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function productCreate(req, res, next) {
  try {
    const { fileName, image, typeName, price, duration, offers, description, categoryId, shopId } = req.body;
    const timeStamp = new Date().toISOString().replace(/[-:TZ.]/g, "");

    const storage = new Storage({
      keyFilename: `./saloonapp.json`,
    });
    const bucketName = "kharphi-image";
    const bucket = storage.bucket(bucketName);
    const base64Image = image.split(";base64,").pop();
    const fileContent = Buffer.from(base64Image, "base64");
    const file = bucket.file(timeStamp + "/" + fileName);

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
    const imageUrl = `https://storage.googleapis.com/${bucketName}/${timeStamp}/${fileName}`;
    stream.end(fileContent);
    const data = {
      typeName: typeName,
      price: price,
      duration: duration,
      image: imageUrl,
      categoryId: categoryId,
      shopId: shopId,
    };
    // await updateCategoryWithImage(categoryId, imageUrl, categoryName);
    const createProduct = await Product.create(data);
    res.status(201).json({
      status: "Success",
      message: "Product created Successfully",
      createProduct,
    });
  } catch (err) {
    next(err);
  }
}

export async function productCategoriesList(req, res, next) {
  try {
    const id = req.params.id;
    const accending = {
      createdAt: -1,
    };
    const productList = await Product.find({
      categoryId: id,
      shopId: req.query.shopId,
    }).sort(accending);
    res.status(201).json({
      status: "Success",
      productList,
    });
  } catch (err) {
    next(err);
  }
}
export async function updateProductOffer(req, res, next) {
  try {
    const id = req.params.id;

    const data = req.body;

    const editData = {
      discountAmount: data.discountAmount,
      totalAmount: data.totalAmount,
      isOffer: data.isOffer,
      shopId: data.shopId,
    };
    const updateData = await Product.findByIdAndUpdate(id, editData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Offer details updated successfully",
      updateData,
    });
  } catch (err) {
    next(err);
  }
}
export async function productUpdate(req, res, next) {
  try {
    const data = req.body;
    const timeStamp = new Date().toISOString().replace(/[-:TZ.]/g, "");
    if (data?.image && data?.fileName) {
      const storage = new Storage({
        keyFilename: `./saloonapp.json`,
      });

      const bucketName = "kharphi-image";
      const bucket = storage.bucket(bucketName);
      const base64Data = data.image;
      if (!base64Data) {
        return res.status(400).send("No Image File Provided");
      }
      const base64Image = base64Data.split(";base64,").pop();
      const fileContent = Buffer.from(base64Image, "base64");
      const file = bucket.file(data?.fileName);
      const stream = file.createWriteStream({
        metadata: {
          contentType: "image/jpeg",
        },
      });

      stream.on("error", (error) => {
        console.error("Error uploading image:", error);
        res.status(500).send("Error uploading image");
      });

      stream.on("finish", () => {});

      const imageUrl = `https://storage.googleapis.com/${bucketName}/${timeStamp}/${data?.fileName}`;
      stream.end(fileContent);

      const updateData = {
        productName: data.productName,
        timing: data.timing,
        offers: data.offers,
        description: data.description,
        image: imageUrl,
      };

      const ProductDetailsUpdate = await Product.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        status: "success",
        message: "Product Updated Successfully",
        ProductDetailsUpdate,
      });
    } else {
      const updateData = {
        productName: data.productName,
        timing: data.timing,
        offers: data.offers,
        description: data.description,
      };
      const ProductDetailsUpdate = await Product.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        status: "success",
        message: "Product Updated Successfully",
        ProductDetailsUpdate,
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function productTypesUpdate(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;
    const details = {
      typeName: data?.typeName,
      price: data?.price,
      duration: data?.duration,
      image: data?.image,
    };
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

      const fileds = { image: publicUrl };

      const updateDetails = await Product.findByIdAndUpdate(id, fileds, {
        new: true,
        runValidators: true,
      });

      res.status(201).json({
        status: "Updated",
        updateDetails,
      });
    } else {
      const updateDetails = await Product.findByIdAndUpdate(id, details, {
        new: true,
        runValidators: true,
      });

      res.status(201).json({
        status: "Updated",
        updateDetails,
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function getSinleProduct(req, res, next) {
  try {
    const productId = req.params.id;

    const productData = await Product.findOne({ _id: productId }).populate("categoryId").populate("shopId");
    res.status(201).json({
      status: "Get Product Details Successfully",
      productData,
    });
  } catch (err) {
    next(err);
  }
}
