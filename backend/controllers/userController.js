import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/emailServices.js';
import { createResetPasswordMessage, createWelcomeMessage } from '../utils/messageServices.js';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const findUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const validatePassword = async (password, userPassword) => {
  const isMatch = await bcrypt.compare(password, userPassword);
  if (!isMatch) {
    throw new Error('Invalid password');
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    await validatePassword(password, user.password);
    const token = createToken(user._id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();
    const token = createToken(savedUser._id);

    await sendEmail({
      email: email,
      subject: 'Welcome to our store',
      html: createWelcomeMessage(newUser),
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.PRODUCT_URL}/reset-password/${resetToken}`;
    await sendEmail({
      email,
      subject: 'Reset password',
      html: createResetPasswordMessage(resetUrl),
    });
    res.json({ message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.body.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateName = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await findUserById(req.body.userId);
    user.name = name || user.name;
    await user.save();
    res.json({ message: 'Name updated', name: user.name });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserById(req.body.userId);

    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    user.email = email || user.email;
    await user.save();
    res.json({ message: 'Email updated', email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = await findUserById(req.body.userId);

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    await validatePassword(password, user.password);
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
