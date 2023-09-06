const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const Tour = require('./models/tourModel');

process.on('uncaughtException', (err) => {
  // console.log(err.name, err.message);

  console.log('uncaught exception 🎈. Shutting down....');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// local connection
// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     // useCreateIndex: true,
//     // useFindAndModify: false,
//   })
//   .then(() => {
//     // console.log(con.connections);
//     console.log('DB connected');
//   });

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB connected');
  });
// .catch((err) => {
//   console.log(err);
// });

// .then((con) => {
//   console.log(con.connections);
//   console.log('DB connected');
// });

// console.log(process.env.NODE_ENV);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

// errors outside express
// unhandeled promise rejections (like auth error ex)

process.on('unhandledRejection', (err) => {
  // console.log(err.name, err.message);

  console.log('Unhandled rejection 🎈. Shutting down....');
  console.log(err.name, err.message);

  // console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
// in prod there are ways tools to restarts app
