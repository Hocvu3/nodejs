const sendErrorDev = (err,req,res) => {
  if(req.originalUrl.startsWith('/api')){
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message
    })
  }
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
    sendErrorDev(err,req, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};
