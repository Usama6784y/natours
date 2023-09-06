const mongoose = require('mongoose');
const Tour = require('./tourModel');

// Define the review schema
const reviewSchema = new mongoose.Schema(
  {
    user: { type: String, required: true }, // Name of the user who wrote the review
    rating: { type: Number, min: 1, max: 5 }, // Rating (from 1 to 5)
    review: { type: String, required: [true, "Review can't be empty."] }, // Review comment
    createdAt: { type: Date, default: Date.now }, // Timestamp for when the review was created
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    // eslint-disable-next-line no-dupe-keys
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a User.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({ path: 'tour', select: 'name' }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// instance not static method
// in static this points model
reviewSchema.statics.calcAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
reviewSchema.post('save', function () {
  // Review.calcAverageRating(this.tour);
  // this = current doc and const is model
  this.constructor.calcAverageRating(this.tour);
  // next();
});

// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   console.log(this.schema._requiredpaths);
//   console.log(this.op);

//   next();
// });

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // console.log(this.op);
  // console.log('.............Firt');

  this.r = await this.findOne().clone();

  // console.log('..........First');
  // // console.log(this.r);
  // console.log('..........second');

  // console.log(this.op);
  // console.log(this.schema._requiredpaths);

  this.op = 'findOneAndUpdate';
  delete this.schema._requiredpaths;
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // this points executed query obj
  // console.log(this.r);
  if (this.r) {
    await this.r.constructor.calcAverageRating(this.r.tour);
  }
});

// Create the review model based on the schema
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
