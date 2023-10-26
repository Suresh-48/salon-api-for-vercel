import offers from "../models/offersModel.js";
import product from "../models/productModel.js";

export async function createOffers(req, res, next) {
  try {
    const data = req.body;

    const createData = await offers.create({
      categoryId: data.categoryId,
      productId: data.productId,
      fromDate: data.fromDate,
      toDate: data.toDate,
      amount: data.amount,
      discountAmount: data.discountAmount,
      discount: data.discount,
      shopId: data.shopId,
    });

    res.status(201).json({
      message: "Product offers created successfully",
      createData,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateOffers(req, res, next) {
  try {
    const id = req.params.id;

    const editData = {
      fromDate: data.fromDate,
      toDate: data.toDate,
      amount: data.amount,
      discountAmount: data.discountAmount,
      discount: data.discount,
    };

    const updateData = await offers.findByIdAndUpdate(id, editData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Offers updated successfully",
      updateData,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllOffers(req, res, next) {
  try {
    const data = await product.find({ shopId: req.query.shopId }).populate("categoryId").populate("populate");

    res.status(200).json({
      message: "Get all offers details successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOffers(req, res, next) {
  try {
    const offerId = req.params.id;

    const data = await offers.findOne({ _id: offerId }).populate("categoryId").populate("populate");

    res.status(200).json({
      message: "Get offer details successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteOffers(req, res, next) {
  try {
    const offersId = req.params.id;

    const deleteData = await offers.findByIdAndDelete({
      _id: offersId,
    });
    res.status(200).json({
      message: "Offers deleted successfully",
      deleteData,
    });
  } catch (err) {
    next(err);
  }
}
export async function getProductOffersList(req, res, next) {
  try {
    const data = await product.find({ isOffer: true, shopId: req.query.shopId }).populate("categoryId");
    res.status(200).json({
      message: "Get all offer products",
      data,
    });
  } catch (err) {
    next(err);
  }
}
