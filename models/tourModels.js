const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name must be required'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'durations must be required'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'GroupSize must be required'],
  },
  difficulty: {
    type: String,
    required: [true, 'difficulty must be required'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price should be mention'],
  },
  Pricediscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String
  },
  images: [String],
  createdBy: {
    type: Date,
    default: Date.now(),
   select: false
  },
  StartDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
