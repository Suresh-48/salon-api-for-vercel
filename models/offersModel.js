import mongoose from "mongoose";
const {Schema, model} = mongoose;

const offerSchema = new Schema({
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    fromDate: {
        type: Date
    },
    toDate:{
        type: Date
    },
    amount: {
        type: Number
    },
    discount:{
        type: Number
    },
    discountAmount:{
        type: Number,
    },

});

const offers = model('Offers',offerSchema);
export default offers;