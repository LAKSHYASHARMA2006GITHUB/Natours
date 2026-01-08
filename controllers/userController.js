const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModels');

exports.getAllUser = catchAsync(async(req, res,next) => {
   const Users = await User.find();
    

    //send query
    res.status(200).json({
      status: 'success',
      // requestTimeAt: req.requestTime,
      result: Users.length,
      data: {
        Users,
      },
    });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};

exports.UpdateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};
