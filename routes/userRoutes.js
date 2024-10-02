const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.patch('/updateMyPassword', authController.protect,authController.updatePassword);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);
userRouter.patch('/updateMe', authController.protect, authController.updateMe);
userRouter.delete('/deleteMe', authController.protect, authController.deleteMe);
userRouter.get('/me', authController.protect, userController.getMe, userController.getUser);

userRouter.use(authController.restrictedTo('admin'));

userRouter
  .route("/")
  .get(authController.protect,userController.getAllUsers)
  // .post(userController.createUser);

userRouter
  .route("/:id")
  .get(authController.protect,userController.getUser)
  .patch(authController.protect,userController.updateUser)
  .delete(authController.protect,userController.deleteUser);

module.exports = userRouter;