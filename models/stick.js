const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StickSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 200 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, min: 0 },
  has_image: Boolean,
});

StickSchema.virtual('url').get(function () {
  return `/stick/${this._id}`;
});

StickSchema.virtual('image_url').get(function () {
  return this.has_image
    ? `/images/${this._id}.webp`
    : '/images/placeholder.webp';
});

module.exports = mongoose.model('Stick', StickSchema);
