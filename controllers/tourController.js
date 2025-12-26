// const fs = require('fs');
const Tour = require('./../models/tourModels');
const APIFeatures = require('./../utils/apiFeatures.js'); 

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

exports.getAllTour = async (req, res) => {
  try {
  
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
  } catch (err) {
    res.status(404).json({
      status: 'Not found',
      message: 'Tours not found',
    });
  }
};

exports.getTour = async (req, res) => {
  // console.log(req.params);
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);  // for testi
  // // if(id > tours.length){

  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'not found',
      message: 'tours not found',
    });
  }

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

exports.postTour = async (req, res) => {
  // console.log(req.body);

  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      messsage: 'success',
      data: {
        newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      messsage: err,
    });
  }
};

exports.patchTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'updated',
      data: {
        tour: '<updated tour here...>',
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      messsage: 'updatation falied',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'deleted',
      message: 'Tours deleted successfully',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      messsage: 'deletion falied',
    });
  }
};

exports.getTourStats = async(req,res)=>{
  try{
     const stats = await Tour.aggregate([
       {
         $match: { ratingsAverage: { $gte: 4.7 } },
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
  }
  catch(err){
     res.status(400).json({
     status:'failed',
     message:err  
    });
  }
}

exports.getMonthlyPlan = async(req,res) =>{
  try{
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

  }catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }
}
