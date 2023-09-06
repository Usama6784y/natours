/* eslint-disable prefer-const */
// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// //  route handlers

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .json({ status: 'failed', message: 'price or body not found' });
//   }
//   next();
// };

// exports.checkId = (req, res, next, val) => {
//   // const id = req.params.id * 1;
//   console.log(`the id is ${val}`);

//   if (val > tours.length) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'invalid id',
//     });
//   }
//   next();
// };

// exports.getTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// };

// exports.getTour = (req, res) => {
//   const id = req.params.id * 1;
//   const foundObject = tours.find((el) => el.id === id);
//   //   let foundObject = null;

//   //   for (let i = 0; i < tours.length; i++) {
//   //     const currentObject = tours[i];

//   //     if (currentObject.id === Number(req.params.id)) {
//   //       foundObject = currentObject;
//   //       break; // Exit the loop since we found the desired object
//   //     }
//   //   }

//   // if (id > tours.length) {
//   //   return res.status(404).json({
//   //     status: 'failed',
//   //     message: 'invalid id',
//   //   });
//   // }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: foundObject,
//     },
//   });
// };

// exports.createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   console.log(`new id is ${newId}`);
//   // can improve
// const newTour = Object.assign({ id: newId }, req.body);
//   console.log(`new tour: ${JSON.stringify(newTour)}`);
//   // const newId = tours[tours.length - 1].id + 1;
//   // console.log(`new id is ${newId}`);
//   // const newTour = Object.assign({ id: newId }, req.body);
//   // console.log(`new tour: ${JSON.stringify(newTour)}`);
//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {}
//   );

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// };
const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
// const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
// upload.single('image');  req.file
// upload.array(('images', 5)); req.files (for field as well)

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
  //   promise.all whenever multiple promise of loop
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = factory.getAll(Tour);
//  catchAsync(async (req, res, next) => {
//   const features = new ApiFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitsFields()
//     .paginate();

//   const tours = await features.query;
//   // .populate({
//   //   path: 'guides',
//   //   select: '-__v -passwordChangedAt',
//   // });;
//   // if (req.method === 'PATCH') {
//   //   // req.params.id = tours[0]._id;

//   //   req.params = {};
//   //   req.params.id = tours[0]._id.toString();
//   // const id = 9;

//   // this.updateTour(req, res, next, id);

//   // return 5;
//   // }

//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

// try {
// console.log(req.query);

// const queryObj = { ...req.query };
// const excludeFields = ['page', 'sort', 'limit', 'fields'];
// excludeFields.forEach((el) => delete queryObj[el]);

// let queryStr = JSON.stringify(queryObj);

// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
// console.log(JSON.parse(queryStr), req.query);
// let query = Tour.find(JSON.parse(queryStr));

// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   query = query.sort('-createdAt');
// }

// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields);
// } else {
//   query = query.select('-__v');
// }
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;

// query = query.skip(skip).limit(limit);
// // page 2 limit 10
// // query = query.skip(10).limit(10)

// if (req.query.page) {
//   const tourNums = await Tour.countDocuments();
//   if (skip >= tourNums) throw new Error('This page not exist');
// }

// const tours = await Tour.find()
//   .where('duration')
//   .equals(5)
//   .where('difficulty')
//   .equals('easy');
// lte

//   } catch (err) {
//     res.status(404).json({
//       status: 'failed',
//       message: err.message,
//     });
//   }
// };

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

// catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   // .populate({
//   //   path: 'guides',
//   //   select: '-__v -passwordChangedAt',
//   // });
//   // is actually findOne()

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// console.log(req.params);
// const id = req.params.id * 1;

// const tour = tours.find((el) => el.id === id);

//   try {

//   } catch (err) {
//     res.status(404).json({
//       status: 'failed',
//       message: err.message.toString(),
//     });
//   }
// };

// const catchAsync = (fn) => {
//   fn(req, res, next).catch((err) => next(err));
// };

exports.createTour = factory.createOne(Tour);

// catchAsync(async (req, res, next) => {
//   // console.log(req.body);

//   // const newId = tours[tours.length - 1].id + 1;
//   // const newTour = Object.assign({ id: newId }, req.body);

//   // tours.push(newTour);

//   // fs.writeFile(
//   //   `${__dirname}/dev-data/data/tours-simple.json`,
//   //   JSON.stringify(tours),
//   //   (err) => {

//   const newTour = await Tour.create(req.body);

//   if (!newTour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });

//   try {

//   } catch (err) {
//     console.log(err);
//     res.status(404).json({
//       status: 'failed',
//       message: err,
//     });
//   }
// };

//   );
// };

// exports.updateTour = catchAsync(async (req, res, next, id) => {
exports.updateTour = factory.updateOne(Tour);

//   try {

//   } catch (err) {
//     res.status(404).json({
//       status: 'failed',
//       message: err,
//     });
//   }
// };

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

//   try {

//   } catch (err) {
//     res.status(404).json({
//       status: 'failed',
//       message: err,
//     });
//   }
// };

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: '$ratingsAverage',
        _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 },

        numRating: { $sum: '$ratingsQuantity' },

        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: -1 } },
    // { $match: { _id: { $ne: 'EASY' } } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

//   try {

//   } catch (err) {
//     res.status(404).json({
//       status: 'failed',
//       message: err,
//     });
//   }
// };

exports.getMonthlyPLan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    // {
    //   $limit: 6,
    // },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  });
});

//   try {

//   } catch (err) {
//     res.status(404).json({
//       status: 'failed',
//       message: err,
//     });
//   }
// };

exports.getToursWithin = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius =
    unit === 'mi' ? Number(distance) / 3963.2 : Number(distance) / 6378.1;
  if (!lat || !lng) {
    next(new AppError('please provide latlng in format lat,lng', 400));
  } else {
    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data: tours,
      },
    });
  }
  console.log(distance, lat, lng, unit);
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(new AppError('please provide latlng in format lat,lng', 400));
  } else {
    // alose require geo index
    // if multiple geo index the keys parameter to choose index
    // r8 now its startLocation index
    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'point',
            coordinates: [lng * 1, lat * 1],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        data: distances,
      },
    });
  }
});
