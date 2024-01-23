import { Request, Response } from 'express';

import { User } from './model.ts';
import { STATUS_SUCCESS } from '../strings.ts';
import { catchAsync } from '../utils.ts';

export const getUsers = catchAsync(async (_: Request, res: Response) => {
  const users = await User.find();

  console.log(users);

  res.status(200).json({
    status: STATUS_SUCCESS,
    data: {
      users,
      length: users.length,
    },
  });
});