const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoute');

// const {
//   getTours,
//   createTour,
//   getTour,
//   checkId,
//   checkBody,
// } = require('./../controllers/tourController');

const router = express.Router();

// ***************

// post /tour/5455/reviews

// get /tour/5455/reviews

// get /tour/5455/reviews/6f4d5

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictToAsync('user'),
//     reviewController.createReview
//   );

// **** a router is actually just a mdlwr
// mounting a router as in appjs

router.use('/:tourId/reviews', reviewRouter);

// router.param('id', (req, res, next, val) => {
//   console.log(` id is ${val}`);
//   next();
// });

// router.param('id', checkId);

// routes
// router.get('/', tourControllers.getAllTours);

// router.post('/', tourControllers.checkBody, tourControllers.createTour);
// router.post('/', tourControllers.createTour);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictToAsync('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPLan
  );

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// not recomended
// router
// .route('/')
// .get(catchAsync(tourController.getAllTours))
// .post(tourController.createTour);

router
  .route('/tours-within/:distance/center/:latlng/:unit')
  .get(tourController.getToursWithin);
// other wat is query tours-distance?distance=223&center=65,45&unit=mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)

  // .get(authController.protect, tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictToAsync('admin', 'lead-guide'),
    tourController.createTour
  );
// .patch(tourController.getAllTours)

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictToAsync('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictToAsync('admin', 'lead-guide'),
    tourController.deleteTour
  );

//  for opt variable ?
// router.get('/:id', tourController.getTour);

module.exports = router;
