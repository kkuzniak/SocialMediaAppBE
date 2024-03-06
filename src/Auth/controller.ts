import { NextFunction, Request, Response } from 'express';
import randomColor from 'randomcolor';

import { STATUS_SUCCESS } from '../strings';
import { createAndSendToken } from '../User/utils';
import { catchAsync } from '../utils';
import { User } from '../User/model';
import { ApiError } from '../Error/types';

/**
 * Endpoint that signs up the user
 *
 * @param req - Request
 * @param res - Response
 */
export const signup = catchAsync(async (req: Request, res: Response) => {
  const { body } = req;
  const { name, email, password, passwordConfirm } = body;

  const photoBackground = randomColor();

  const newUser = await User.create({
    name,
    email,
    photoBackground,
    password,
    passwordConfirm,
  });

  createAndSendToken(newUser, 201, req, res);
});

/**
 * Endpoint that logs in the user
 *
 * @param req - Request
 * @param res - Response
 */
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  const isPasswordCorrect = await user.isPasswordCorrect(password, user.password);

  if (!user || !isPasswordCorrect) {
    return next(new ApiError('Incorrect email or password', 401));
  }

  createAndSendToken(user, 200, req, res);
});

/**
 * Endpoint that logs out the user
 *
 * @param res - Response
 */
export const logout = catchAsync(async (_: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: STATUS_SUCCESS,
  });
});