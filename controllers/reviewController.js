const Review = require('../models/reviewModal');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);
// catchAsync(async (req, res, next) => {
//   let filterobj = {};
//   if (req.params.tourId) {
//     filterobj = { tour: req.params.tourId };
//   }
//   const reviews = await Review.find(filterobj);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// exports.createReview = catchAsync(async (req, res, next) => {
//   // // Allow nested routes
//   // if (!req.body.tour) req.body.tour = req.params.tourId;
//   // if (!req.body.user) req.body.user = req.user.id;

//   const newReview = await Review.create(req.body);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });

exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
