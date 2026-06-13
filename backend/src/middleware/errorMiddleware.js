function sendErrorDev(err, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    code: err.code,
    error: err,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  if (!err.isOperational) {
    err.statusCode = 500;
    err.status = "error";
    err.code = "INTERNAL_SERVER_ERROR";
    err.message = "Something went wrong.";
  }

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}

export default function errorMiddleware(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Internal server error.";

  if (err.code === 11000) {
    err.message = `Duplicate key: ${Object.keys(err.keyPattern)[0]} - ${err.keyValue.email}`;
  }

  if (process.env.NODE_ENV === "production") {
    return sendErrorProd(err, res);
  } else {
    return sendErrorDev(err, res);
  }
}
