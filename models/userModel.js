import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      // lowercase: true,
    },
    address: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
    },
    passwordConfirm: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    role: {
      type: String,
    },
    sessionId: {
      type: String,
    },
    fcmToken: {
      type: String,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

userSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

userSchema.set("autoIndex", true);

const User = model("User", userSchema);
export default User;
