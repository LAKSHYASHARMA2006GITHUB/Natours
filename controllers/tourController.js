// const fs = require('fs');
const AppError = require('../utils/appError.js');
const Tour = require('./../models/tourModels');
const APIFeatures = require('./../utils/apiFeatures.js'); 
const catchAsync = require('./../utils/catchAsync.js')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summery,difficulty';
  next();
};



// const tours = JSON.parse(  //testing purpose
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//middleware

// exports.checkID=(req,res,next,val)=>{
//  if (req.params.id * 1 > tours.length) {
//    return res.status(404).json({
//      status: 'failed',
//      message: 'Invalid ID',
//    });
//  }
//  next();
// }

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'failed',
//       message: 'Missind name or price',
//     });
//   }
//   next();
// };

// Routes handlers

exports.getAllTour = catchAsync(async (req, res,next) => {
  
    //Execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tours = await features.query;
    

    //send query
    res.status(200).json({
      status: 'success',
      // requestTimeAt: req.requestTime,
      result: tours.length,
      data: {
        tours,
      },
    });
});

exports.getTour = catchAsync( async (req, res,next) => {
  // console.log(req.params);
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);  // for testi
  // // if(id > tours.length){
  const tour = await Tour.findById(req.params.id);
    if(!tour){
      return next(new AppError('No tour found with that ID',404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
});



exports.postTour = catchAsync(async (req, res,next) => {
  const newTour = await Tour.create(req.body);

  if (!newTour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(201).json({
    messsage: 'success',
    data: {
      newTour,
    },
  });
});

exports.patchTour =  catchAsync(async(req, res,next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'updated',
      data: {
        tour: '<updated tour here...>',
      },
    });
 
});

exports.deleteTour = catchAsync(async (req, res,next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(204).json({
      status: 'deleted',
      message: 'Tours deleted successfully',
      data: null,
    });
});

exports.getTourStats = catchAsync(async(req,res,next)=>{
     const stats = await Tour.aggregate([
       {
         $match: { ratingsAverage: { $gte: 4.5 } },
       },
       {
         $group: {
          //  _id: '$ratingAverage',
           _id: {$toUpper:'$difficulty'},
           numTours:{$sum:1},
           numsRatings:{$sum : '$ratingsQuantity'},
           avgRating: { $avg: '$ratingsAverage' },
           avgPrice: { $avg: '$price' },
           minPrice: { $min: '$price' },
           maxPrice: { $max: '$price' },
         },
       },
       {
        $sort:{
          avgPrice:1
        }
       },
      //  {
      //   $match:{
      //     _id:{$ne:'EASY'}
      //   }
      //  }
     ]);
      res.status(200).json({
        status: 'success',
        data: {
          stats
        },
      });
  
});

exports.getMonthlyPlan = catchAsync(async(req,res,next) =>{
    const year = req.params.year * 1; // transform to number.
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group:{
          _id:{$month:'$startDates'},
          numTourStarts:{$sum:1},
          tours:{$push:'$name'}
        }
      },
      {
        $addFields:{month:'$_id'}
      },
      {
        $project:{
          _id:0
        }
      },
      {
        $sort:{numTourStarts:-1}
      },
      {
        $limit:12
      }
    ]);
    res.status(200).json({
      status:'success',
      data:{
          plan
      }
    })
});
