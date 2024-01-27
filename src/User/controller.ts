import { Request, Response } from 'express';

import { User } from './model';
import { STATUS_SUCCESS } from '../strings';
import { catchAsync } from '../utils';

export const getUsers = catchAsync(async (_: Request, res: Response) => {
  const users = await User.find();

  res.status(200).json({
    status: STATUS_SUCCESS,
    data: {
      users,
      length: users.length,
    },
  });
});