const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const fs = require('fs');

// Routes Handlers

const router = express.Router();

router.post('/signup',authController.signup);

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
