const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name must be required'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or euual then 40 characters'],
      minLength: [10,'A tour name must have greater or equal then 10 characters'],
      // validate:[validator.isAlpha,'Tour name is only contains characters']    not use in the name gives erroe while spaces came
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty is either :easy,medium,hard',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'the rating must above the 1.0'],
      max: [5, 'the rating must below the 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price should be mention'],
    },
    Pricediscount:{
      type:Number,
      validate:{
        validator:function(val){
          // this only points the current doc on NEW document creation
          return val < this.price; //250 < 200
        }, 
        message :'Discount price ({VALUE}) should be below the originl price'   
      }
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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




//Aggeration middleware
tourSchema.pre('aggregate',function(next){
  this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
  console.log(this.pipeline());
  next();
})
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;



