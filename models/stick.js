const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StickSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, min: 0 },
  image_file_name: String,
});

StickSchema.virtual('url').get(function () {
  return `/stick/${this._id}`;
});

StickSchema.virtual('image_url').get(function () {
  return this.image_file_name
    ? `/images/${this.image_file_name}`
    : '/images/placeholder.webp';
});

module.exports = mongoose.model('Stick', StickSchema);
