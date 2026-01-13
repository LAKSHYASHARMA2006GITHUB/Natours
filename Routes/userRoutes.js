const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const fs = require('fs');

// Routes Handlers

const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword',authController.protect,authController.updatePassword);

router.patch('/updateMe', authController.protect, userController.updateMe);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/') 
  .get(userController.getAllUser)
  .post(userController.createUser); 

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.UpdateUser)
  .delete(userController.deleteUser);

module.exports = router;
