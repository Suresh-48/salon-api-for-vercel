import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const deviceSchema = new Schema({

 deviceId: {
    type: mongoose.Schema.Types.ObjectId,
 },
 deviceData:{
    type: JSON,
 },
 phoneNumber: {
    type: String,
 }

},
{ timestamps: true });
const deviceDetails = model('DeviceDetails', deviceSchema);
export default deviceDetails;
