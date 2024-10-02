const User = require('../models/userModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');

  exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
  }

  exports.getAllUsers = handlerFactory.getAll(User);
  exports.getUser = handlerFactory.getOne(User);
  exports.updateUser = handlerFactory.updateOne(User);
  // exports.createUser = handlerFactory.createOne(User);
  exports.deleteUser = handlerFactory.deleteOne(User);