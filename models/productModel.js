import mongoose from 'mongoose';
const { model, Schema } = mongoose;

const productSchema = new Schema(
  {
    typeName: {
      type: String,
    },
    price: {
      type: Number,
    },
    discountAmount: {
      tyep: Number,
    },
    duration: {
      type: String,
    },
    image: {
      type: String,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    totalAmount: {
      type: String,
    },
    isOffer: {
      type: Boolean,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

productSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

productSchema.set('autoIndex', true);

const Product = model('Product', productSchema);
export default Product;
