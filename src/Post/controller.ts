import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

import { catchAsync } from '../utils';
import { STATUS_SUCCESS } from '../strings';
import { Post } from './model';
import { ApiError } from '../Error/types';
import {
  A_POST_DOESNT_EXIST,
  THE_LOGGED_IN_USER_IS_NOT_AN_OWNER,
} from './strings';
import { ToggleLikeActionType } from './types';
import { postImageFilter } from './utils';
import { S3DeleteUserImage, S3UploadUserImage } from '../S3/controller';
import { getUserImageFilePath } from '../S3/utils';

const storage = multer.memoryStorage();
const upload = multer({ storage, fileFilter: postImageFilter });

export const checkPostsExistance = catchAsync(
  async (request: Request, _: Response, next: NextFunction) => {
    const { params } = request;

    const { id: postId } = params;

    const document = await Post.findById(postId);

    if (!document) {
      return next(new ApiError(A_POST_DOESNT_EXIST, 404));
    }

    request.postDocument = document;

    next();
  },
);

export const checkPostsOwner = catchAsync(
  async (request: Request, _: Response, next: NextFunction) => {
    const { user, postDocument } = request;

    const { id: userId } = user;

    if (postDocument.user.toString() !== userId) {
      return next(new ApiError(THE_LOGGED_IN_USER_IS_NOT_AN_OWNER, 400));
    }

    next();
  },
);

export const uploadPostImage = upload.single('images');

export const createPost = catchAsync(
  async (request: Request, response: Response, _: NextFunction) => {
    const { body, user, file } = request;
    const { text } = body;
    const { id: userId } = user;
    let images: string[] = [];

    if (file) {
      images = [getUserImageFilePath(userId, file)];

      await S3UploadUserImage(file, images[0]);
    }

    const document = await Post.create({ user: userId, text, images });

    response.status(200).json({
      status: STATUS_SUCCESS,
      data: {
        data: document,
      },
    });
  },
);

export const updatePost = catchAsync(
  async (request: Request, response: Response, _: NextFunction) => {
    const { body, params, user, file, postDocument } = request;
    const { text } = body;
    const { id: postId } = params;
    const { id: userId } = user;

    const [prevImagePath] = postDocument.images;

    if (prevImagePath) {
      await S3DeleteUserImage(prevImagePath);
    }

    let images: string[] = [];

    if (file) {
      images = [getUserImageFilePath(userId, file)];

      await S3UploadUserImage(file, images[0]);
    }

    const updatedDocument = await Post.findByIdAndUpdate(
      postId,
      {
        text,
        updatedAt: Date.now(),
        images,
      },
      { new: true },
    );

    response.status(200).json({
      status: STATUS_SUCCESS,
      data: {
        data: updatedDocument,
      },
    });
  },
);

export const getPost = catchAsync(
  async (request: Request, response: Response, next: NextFunction) => {
    const { params } = request;
    const { id: postId } = params;

    const document = await Post.findById(postId)
      .populate({
        path: 'user',
        select: 'firstName lastName',
      })
      .populate({
        path: 'likes',
        select: 'firstName lastName',
      })
      .sort({ addedAt: -1 })
      .select('-__v');

    if (!document) {
      return next(new ApiError(A_POST_DOESNT_EXIST, 404));
    }

    response.status(200).json({
      status: STATUS_SUCCESS,
      data: {
        data: document,
      },
    });
  },
);

export const deletePost = catchAsync(
  async (request: Request, response: Response, _: NextFunction) => {
    const { postDocument } = request;
    const { _id: postId } = postDocument;

    const [imagePath] = postDocument.images;

    if (imagePath) {
      await S3DeleteUserImage(imagePath);
    }

    await Post.findByIdAndDelete(postId);

    response.status(204).json({
      status: STATUS_SUCCESS,
      data: null,
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

      const document = await Post.findByIdAndUpdate(
        postId,
        { [action]: { likes: userId } },
        { new: true },
      ).populate({
        path: 'likes',
        select: 'firstName lastName',
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
    },
  );

export const getAllPosts = catchAsync(
  async (_: Request, response: Response) => {
    const documents = await Post.find()
      .populate({
        path: 'user',
        select: 'firstName lastName',
      })
      .populate({
        path: 'likes',
        select: 'firstName lastName',
      })
      .populate({
        path: 'comments',
        select: '_id text likes addedAt',
      })
      .sort({ addedAt: -1 })
      .select('-__v');

    response.status(200).json({
      status: STATUS_SUCCESS,
      results: documents.length,
      data: {
        data: documents,
      },
    });
  },
);
