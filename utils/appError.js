class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = String(statusCode);
    // console.log(
    //   typeof statusCode,
    //   `$(statusCode)`.startsWith('4') ? 'fail' : 'error'
    // );
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
