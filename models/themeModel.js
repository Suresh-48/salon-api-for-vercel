import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const themeSchema = new Schema({
  background: {
    type: String,
  },
  color: {
    type: String,
  },
});

themeSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

themeSchema.set('autoIndex', true);

const Theme = model('Theme', themeSchema);
export default Theme;
