const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500; // Default to 500 Internal Server Error
  res
    .status(statusCode)
    .json({ error: err.message || "Internal Server Error" });
};

module.exports = errorHandler;
