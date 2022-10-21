import crypto from 'crypto';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import { asyncHandler } from '../middleware/async.js';
import sendEmail from '../utils/sendEmail.js';
import sendTokenResponse from '../utils/sendTokenResponse.js';

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, role, password } = req.body;

  // Create user
  const user = await User.create({ name, email, role, password });

  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse(`Email and password are required`, 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  // Validate password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }

  res.status(200).json({ success: true, data: user });
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(`User with email ${req.body.email} does not exist`, 404)
    );
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to \n\n ${resetUrl}`;

  try {
    sendEmail({ email: user.email, subject: 'Password reset token', message });
    return res.status(200).json({ success: true, data: 'Email sent.' });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(`Email could not be sent`, 500));
  }

  return res.status(200).json({ success: true, data: user });
});

// @desc      Reset Password
// @route     PUT /api/v1/auth/resetpassword/:token
// @access    Private
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Hashed token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});
