import express from 'express';
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateName,
  updateEmail,
  updatePassword,
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:resetToken', resetPassword);
userRouter.get('/profile', auth, getProfile);
userRouter.put('/profile/name', auth, updateName);
userRouter.put('/profile/email', auth, updateEmail);
userRouter.put('/profile/password', auth, updatePassword);

export default userRouter;
