const sendErrorDev = (err, res) => {
  errorCode = err.status || 500;
  errorStatus = err.status || "error";
  res.status(errorCode).json({
    status: errorStatus,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  else{
    console.error("Error", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
}
module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};
