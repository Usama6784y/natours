const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoute');
const viewRouter = require('./routes/viewRoutes');
// app
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));
// env
// for headers
// app.use(helmet());

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         'script-src': ["'self'", 'cdn.jsdelivr.net'],
//         'connect-src': ["'self'", 'api.maptiler.com', 'ws://127.0.0.1:62906'],
//         'img-src': [
//           "'self'",
//           'data:',
//           'api.maptiler.com',
//           'tile.openstreetmap.org',
//         ],
//       },
//     },
//   })
// );

// Global mdlwr
// console.log(app.get('env'));
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'TOO many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// adding body to req.body
app.use(
  express.json({
    limit: '10kb',
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// data sanitization

app.use(mongoSanitize());

app.use(xss());
// parameter pollution like sort
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty',
      'price',
    ],
  })
);

// app.use(express.static(`${__dirname}/public`));
// app.use(express.static(`${__dirname}/public`));

// middleware order matters in code
app.use((req, res, next) => {
  // console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);

  next();
});

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from server', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.status(200).send('You can post');
// });

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // res.status(400).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // // eslint-disable-next-line no-unused-expressions
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
