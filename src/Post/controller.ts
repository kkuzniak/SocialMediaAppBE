import { NextFunction, Request, Response } from 'express';

import { catchAsync } from '../utils';
import { STATUS_SUCCESS } from '../strings';
import { Post } from './model';
import { ApiError } from '../Error/types';
import { A_POST_DOESNT_EXIST, YOU_CANNOT_REMOVE_OTHER_USER_POST } from './strings';
import { ToggleLikeActionType } from './types';

export const createPost = catchAsync(async (request: Request, response: Response) => {
  const { body, user } = request;
  const { text } = body;
  const { id: userId } = user;

  const document = await Post.create({ user: userId, text });

  response.status(200).json({
    status: STATUS_SUCCESS,
    data: {
      data: document,
    },
  });
});

export const updatePost = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
  const { body, params } = request;
  const { text } = body;
  const { id: postId } = params;

  const document = await Post.findByIdAndUpdate(postId, { text, updatedAt: Date.now() }, { new: true });

  if (!document) {
    return next(new ApiError(A_POST_DOESNT_EXIST, 404));
  }

  response.status(200).json({
    status: STATUS_SUCCESS,
    data: {
      data: document,
    },
  });
});

export const deletePost = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
  const { params, user } = request;
  const { id: postId } = params;
  const { id: userId } = user;

  const document = await Post.findById(postId);

  if (!document) {
    return next(new ApiError(A_POST_DOESNT_EXIST, 404));
  }

  if (document.user.toString() !== userId) {
    return next(new ApiError(YOU_CANNOT_REMOVE_OTHER_USER_POST, 400));
  }

  await Post.findByIdAndDelete(postId);

  response.status(204).json({
    status: STATUS_SUCCESS,
    data: null,
  });
});

export const toggleLike = (actionType: ToggleLikeActionType) =>
  catchAsync(async (request: Request, response: Response, next: NextFunction) => {
    const action = actionType === ToggleLikeActionType.like ? '$addToSet' : '$pull';

    const { params, user } = request;
    const { id: postId } = params;
    const { id: userId } = user;

    const document = await Post.findByIdAndUpdate(postId, { [action]: { likes: userId } }, { new: true }).populate({
      path: 'likes',
      select: 'name',
    });

    if (!document) {
      return next(new ApiError(A_POST_DOESNT_EXIST, 404));
    }

    response.status(200).json({
      status: STATUS_SUCCESS,
      results: document.likes.length,
      data: {
        data: document.likes,
      },
    });
  });