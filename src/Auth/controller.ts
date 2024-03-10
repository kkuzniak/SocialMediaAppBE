import { NextFunction, Request, Response } from 'express';
import randomColor from 'randomcolor';
import jwt from 'jsonwebtoken';

import { STATUS_SUCCESS } from '../strings';
import { createAndSendToken } from './utils';
import { catchAsync } from '../utils';
import { User } from '../User/model';
import { ApiError } from '../Error/types';
import {
  INCORRECT_EMAIL_OR_PASSWORD,
  PLEASE_PROVIDE_EMAIL_AND_PASSWORD,
  THE_USER_BELONGING_TO_THIS_TOKEN,
  YOU_ARE_NOT_LOGGED_IN,
} from './strings';

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
    return next(new ApiError(PLEASE_PROVIDE_EMAIL_AND_PASSWORD, 400));
  }

  const user = await User.findOne({ email }).select('+password');
  const isPasswordCorrect = await user.isPasswordCorrect(password, user.password);

  if (!user || !isPasswordCorrect) {
    return next(new ApiError(INCORRECT_EMAIL_OR_PASSWORD, 401));
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

/**
 * Middleware to protect the routes and make them only for the logged in users
 *
 * @param request - Request
 * @param response - Response
 * @param next - Next function
 */
export const protect = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
  let token: string;
  const { authorization } = request.headers;

  if (
    authorization && authorization.startsWith('Bearer')
  ) {
    [,token] = authorization.split(' ');
  } else if (request.cookies.jwt) {
    token = request.cookies.jwt;
  }

  if (!token) {
    return next(
      new ApiError(YOU_ARE_NOT_LOGGED_IN, 401),
    );
  }

  const { id: userId } = await <jwt.UserIdJWTPayload>jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(userId);

  if (!currentUser) {
    return next(
      new ApiError(THE_USER_BELONGING_TO_THIS_TOKEN, 401),
    );
  }

  request.user = currentUser;
  response.locals.user = currentUser;

  next();
});