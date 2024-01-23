import { Request, Response } from 'express';
import randomColor from 'randomcolor';

import { STATUS_SUCCESS } from '../strings.ts';
import { User } from '../User/model.ts';
import { createSendToken } from '../User/utils.ts';
import { catchAsync } from '../utils.ts';

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

  createSendToken(newUser, 201, req, res);
});

export const login = async (_: Request, res: Response) => {
  res.status(200).json({
    status: STATUS_SUCCESS,
    message: 'Login hit',
  });
};

export const logout = async (_: Request, res: Response) => {
  res.status(200).json({
    status: STATUS_SUCCESS,
    message: 'Logout hit',
  });
};