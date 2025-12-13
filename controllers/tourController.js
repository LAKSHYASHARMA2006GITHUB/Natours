// const fs = require('fs');
const Tour = require('./../models/tourModels');

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

exports.getAllTour = async(req, res) => {
  try{
    //1 Filtering------------------------------------------------------------
    const queryObj = {...req.query};
    const exculdeFields = ['page','sort','limit','fields'];
    exculdeFields.forEach(el => delete queryObj[el]);

    // 2 advanced filtering--------------------------------------------------


    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g,match =>`$${match}`);
    console.log(JSON.parse(queryStr));
    let query =  Tour.find(JSON.parse(queryStr));

    //sorting----------------------------------------------------------------

    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }
    else{
      query = query.sort('-createdAt');
    }

    //Field limiting---------------------------------------------------------

    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }
    else{
      query = query.select('-__v');
    } 


    //pagination--------------------------------------------------------------

    // query = query.skip(2).limit(10);

    






    // console.log(req.requestTime); for testing purpose
    // if(id > tours.length){
    
    //Execute query
    const tours = await query;
    // console.log(tours)
    
    //send query
    res.status(200).json({
      status: 'success',
      // requestTimeAt: req.requestTime,
      result: tours.length,
      data: {
        tours,
      },
    });
  }catch(err){
    res.status(404).json({
      status:'Not found',
      message:'Tours not found'

    })
  }
};

exports.getTour = async(req, res) => {
  // console.log(req.params);
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);  // for testi
  // // if(id > tours.length){

  try{
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status:'success',
      data:{
        tour
      }
    })

  }catch(err){
    res.status(404).json({
      status:'not found',
      message:'tours not found'
    })
  }

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

exports.postTour = async(req, res) => {
  // console.log(req.body);

  try{

    const newTour = await Tour.create(req.body);
  
  
    res.status(201).json({
      messsage: 'success',
      data: {
        newTour,
      }
    });
  }catch(err){ 
    res.status(400).json({
      status:'failed',
      messsage:err
    })
  }

};

exports.patchTour = async(req, res) => {
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
  try{

     await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'deleted',
      message:'Tours deleted successfully',
      data: null
    });
  } catch(err){
      res.status(400).json({
      status: 'failed',
      messsage: 'deletion falied'
      });
  }

};
