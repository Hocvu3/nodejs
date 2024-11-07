const express = require("express");
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(helmet());
// app.use(
//   helmet.contentSecurityPolicy({
//       directives: {
//           defaultSrc: ["'self'"], // Allow content from the same origin
//           scriptSrc: ["'self'", "https://cdn.jsdelivr.net"], // Allow scripts from self and CDN
//           styleSrc: ["'self'", "https://fonts.googleapis.com"], // Allow styles from self and Google Fonts
//           imgSrc: ["'self'", "data:"] // Allow images from self and data URIs
//       },
//   })
// );
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}
//Limit request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter); // apply to all routes starting with /api

console.log(process.env.NODE_ENV);
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
app.use(express.static(`${__dirname}/public`));
app.use(express.json());

app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
//Prevent parameter pollution
app.use(hpp({
  whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty']
}));
app.use((req,res,next)=>{
  console.log('hello');
  next();
});

app.use((req,res,next)=>{
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
})


// app.get('/api/v1/tours',getAllTours);
// app.get('/api/v1/tours/:id',getTour);
// app.post('/api/v1/tours',createTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);
app.use('/',viewRouter);
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);

app.all('*',(req,res,next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this server!`,404))
});

app.use(globalErrorHandler);

module.exports = app;


