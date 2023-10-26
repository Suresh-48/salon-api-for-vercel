import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  categoryName: {
    type: String,
  },
  image: {
    type: String,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

categorySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

categorySchema.set("autoIndex", true);

const Category = model("Category", categorySchema);
export default Category;
