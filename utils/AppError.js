class AppError extends Error {
  constructor(statusCode, message, data) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.data = data ?? null;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;