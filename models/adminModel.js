import mongoose from "mongoose";
const { Schema, model } = mongoose;

const adminSchema = new Schema(
  {
    name: { type: String },
    email: {type: String },
    mobileNumber: {
      type: String,
      unique: true,
      required: true,
    },
    shopName: { type: String },
    shopRegisterNumber: { type: String },
    shopAddress: { type: String },
    logo: { type: String },
    gstNumber: { type: String },
    state: { type: String, default: "Tamil Nadu" },
    shopCity: { type: String },
    shopPincode: { type: String },
  },
  { timestamps: true }
);

const admin = model("Admin", adminSchema);
export default admin;
