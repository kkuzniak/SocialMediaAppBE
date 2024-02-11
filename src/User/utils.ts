import JWT from 'jsonwebtoken';
import { Request, Response } from 'express';

import { IUser } from './types';
import { STATUS_SUCCESS } from '../strings';

/**
 * Function that generates JWT token for user id
 *
 * @param userId - User id
 * @returns a generated JWT token
 */
const signToken = (userId: string) => JWT.sign({ id: userId }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

/**
 * Function that creates JWT token and sends it to the client
 *
 * @param user - User that wants the JWT
 * @param statusCode - Status code for the client response
 * @param req - Request
 * @param res - Response
 */
export const createSendToken = (user: IUser, statusCode: number, req: Request, res: Response) => {
  const token = signToken(user._id);
  const JWT_EXPIRES_IN_SECONDS = +process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000;

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + JWT_EXPIRES_IN_SECONDS),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  res.status(statusCode).json({
    status: STATUS_SUCCESS,
    token,
    data: {
      user: {
        name: user.name,
        email: user.email,
      },
    },
  });
};