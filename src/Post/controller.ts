import { NextFunction, Request, Response } from 'express';

import { catchAsync } from '../utils';
import { User } from '../User/model';
import { STATUS_SUCCESS } from '../strings';
import { Post } from './model';
import { ApiError } from '../Error/types';
import { A_POST_WITH_THE_GIVEN_ID } from './strings';

export const createPost = catchAsync(async (request: Request, response: Response) => {
  const { text } = request.body;
  const { id: userId } = await User.findOne({ email: 'tester@gmail.com' });

  const document = await Post.create({ user: userId, text });

  response.status(200).json({
    status: STATUS_SUCCESS,
    data: {
      data: document,
    },
  });
});

export const addLike = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
  const { params, user } = request;
  const { id: postId } = params;
  const { id: userId } = user;

  const document = await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });

  if (!document) {
    return next(new ApiError(A_POST_WITH_THE_GIVEN_ID, 404));
  }

  response.status(200).json({
    status: STATUS_SUCCESS,
    data: {
      data: document,
    },
  });
});