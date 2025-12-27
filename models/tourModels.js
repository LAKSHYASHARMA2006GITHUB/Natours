const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name must be required'],
    unique: true,
  },
  slug:String,
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
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
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
    trim: true,
  },
  imageCover: {
    type: String,
  },
  images: [String],
  createdBy: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: {
    type: [Date],
  },
  secretTour:{
    type:Boolean,
    default:false 
  }
},
{
toJSON:{virtuals:true},
toObject:{virtuals:true}
});

tourSchema.virtual('durationweeks').get(function(){

  return this.duration / 7;
})

//middleware in mongoose 
//Document middleware: runs before .save() and .create()

tourSchema.pre('save',function(next){
this.slug = slugify(this.name,{lower:true});
next();
})

// tourSchema.pre('save', function (next) {
//   console.log("will save document"); 
//   next();
// });

// tourSchema.post('save',function(doc,next){
// console.log(doc);
// next();
// })

// Query middleware

// tourSchema.pre('find',function(next){
tourSchema.pre(/^find/,function(next){
this.find({secretTour:{$ne:true}})
this.start = Date.now();
  next();
})

tourSchema.post(/^find/, function (docs,next) {
  console.log(`Query took ${Date.now()-this.start}miliseconds`);
  console.log(docs)
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;



