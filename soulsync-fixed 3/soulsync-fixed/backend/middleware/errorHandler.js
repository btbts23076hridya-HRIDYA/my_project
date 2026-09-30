const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  if (err.code === 11000) {
    statusCode = 400;
    message = `An account with this ${Object.keys(err.keyValue)[0]} already exists.`;
  }
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }
  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
