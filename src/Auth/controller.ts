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
 * @param request - Request
 * @param response - Response
 */
export const signup = catchAsync(
  async (request: Request, response: Response) => {
    const { body } = request;
    const { firstName, lastName, email, password, passwordConfirm } = body;

    const photoBackground = randomColor();

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      photoBackground,
      password,
      passwordConfirm,
    });

    createAndSendToken(newUser, 201, request, response);
  },
);

/**
 * Endpoint that logs in the user
 *
 * @param request - Request
 * @param response - Response
 */
export const login = catchAsync(
  async (request: Request, response: Response, next: NextFunction) => {
    const { body } = request;
    const { email, password } = body;

    if (!email || !password) {
      return next(new ApiError(PLEASE_PROVIDE_EMAIL_AND_PASSWORD, 400));
    }

    const user = await User.findOne({ email }).select('+password');
    const isPasswordCorrect = user
      ? await user.isPasswordCorrect(password, user.password)
      : false;

    if (!user || !isPasswordCorrect) {
      return next(new ApiError(INCORRECT_EMAIL_OR_PASSWORD, 401));
    }

    createAndSendToken(user, 200, request, response);
  },
);

/**
 * Endpoint that logs out the user
 *
 * @param response - Response
 */
export const logout = catchAsync(async (_: Request, response: Response) => {
  response.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  response.status(200).json({
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
export const protect = catchAsync(
  async (request: Request, response: Response, next: NextFunction) => {
    let token: string;
    const { authorization } = request.headers;

    if (authorization && authorization.startsWith('Bearer')) {
      [, token] = authorization.split(' ');
    } else if (request.cookies.jwt) {
      token = request.cookies.jwt;
    }

    if (!token) {
      return next(new ApiError(YOU_ARE_NOT_LOGGED_IN, 401));
    }

    const { id: userId } = await (<jwt.UserIdJWTPayload>(
      jwt.verify(token, process.env.JWT_SECRET)
    ));

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return next(new ApiError(THE_USER_BELONGING_TO_THIS_TOKEN, 401));
    }

    request.user = currentUser;
    response.locals.user = currentUser;

    next();
  },
);
