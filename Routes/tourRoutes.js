const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// router.param('id',tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTour);

router.route('/').get(tourController.getAllTour).post(tourController.postTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.patchTour)
  .delete(tourController.deleteTour);

module.exports = router;
