const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");
const tourRouter = express.Router();
const reviewRouter = require('./reviewRoutes');
tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter.route('/monthly-plan/:year').get(tourController.getMontlyPlan);
tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

tourRouter
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistances);
// /tours-within?distance=233&center=-40,45&unit=mi
tourRouter
  .route("/")
  .get(authController.protect,tourController.getAllTours)
  .post(authController.protect,authController.restrictedTo('admin','lead-guide','guide'),tourController.createTour);
 
tourRouter
  .route("/:id")
  .get(authController.protect,tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictedTo('admin','lead-guide','guide'),
    authController.protect,
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictedTo('admin','lead-guide','guide'),
    tourController.deleteTour
  );
module.exports = tourRouter;
