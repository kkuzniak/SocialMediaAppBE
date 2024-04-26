import { Request, Response, NextFunction } from 'express';

import { catchAsync } from '../utils';
import { Comment } from './model';
import { STATUS_SUCCESS } from '../strings';
import { ToggleLikeActionType } from './types';
import { A_COMMENT_DOESNT_EXIST } from './strings';
import { ApiError } from '../Error/types';

export const createComment = catchAsync(
  async (request: Request, response: Response, _: NextFunction) => {
    const { params, body } = request;
    const { postId } = params;
    const { text } = body;

    console.log(text);

    const document = await Comment.create({ post: postId, text });

    response.status(200).json({
      status: STATUS_SUCCESS,
      data: {
        data: document,
      },
    });
  },
);

export const toggleLike = (actionType: ToggleLikeActionType) =>
  catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
      const action =
        actionType === ToggleLikeActionType.like ? '$addToSet' : '$pull';

      const { params, user } = request;
      const { id: postId } = params;
      const { id: userId } = user;

      const document = await Comment.findByIdAndUpdate(
        postId,
        { [action]: { likes: userId } },
        { new: true },
      ).populate({
        path: 'likes',
        select: 'firstName lastName',
      });

      if (!document) {
        return next(new ApiError(A_COMMENT_DOESNT_EXIST, 404));
      }

      response.status(200).json({
        status: STATUS_SUCCESS,
        results: document.likes.length,
        data: {
          data: document.likes,
        },
      });
    },
  );
