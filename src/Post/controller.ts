import { NextFunction, Request, Response } from 'express';

import { catchAsync } from '../utils';
import { STATUS_SUCCESS } from '../strings';
import { Post } from './model';
import { ApiError } from '../Error/types';
import { A_POST_DOESNT_EXIST } from './strings';

export const createPost = catchAsync(async (request: Request, response: Response) => {
  const { body, user } = request;
  const { text } = body;
  const { id: userId } = user;

  const document = await Post.create({ user: userId, text });

  response.status(200).json({
    status: STATUS_SUCCESS,
    data: document,
  });
});

export const addLike = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
  const { params, user } = request;
  const { id: postId } = params;
  const { id: userId } = user;

  const document = await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });

  if (!document) {
    return next(new ApiError(A_POST_DOESNT_EXIST, 404));
  }

  response.status(200).json({
    status: STATUS_SUCCESS,
    data: document,
  });
});