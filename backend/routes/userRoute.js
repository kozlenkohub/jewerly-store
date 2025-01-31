import express from 'express';
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  adminLogin,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:resetToken', resetPassword);
userRouter.post('/admin', adminLogin);

export default userRouter;
