const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// post /tour/5455/reviews
// post /reviews
// get /tour/5455/reviews

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictToAsync('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictToAsync('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictToAsync('user', 'admin'),
    reviewController.updateReview
  );
module.exports = router;
