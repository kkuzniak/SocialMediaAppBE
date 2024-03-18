import { NextFunction, Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { v4 as uuid } from 'uuid';
import multer from 'multer';

import { catchAsync } from '../utils';
import { STATUS_SUCCESS } from '../strings';
import { Post } from './model';
import { ApiError } from '../Error/types';
import { A_POST_DOESNT_EXIST, YOU_CANNOT_REMOVE_OTHER_USER_POST } from './strings';
import { ToggleLikeActionType } from './types';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadPostImage = upload.single('images');

export const createPost = catchAsync(async (request: Request, response: Response) => {
  const { body, user } = request;
  const { text } = body;
  const { id: userId } = user;
  let images: string[];

  if (request.file) {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const stringifiedUserId = userId.toString();
    const filename = uuid();
    const extension = path.extname(request.file.originalname);

    images = [`${stringifiedUserId}/${filename}${extension}`];

    const s3Command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: images[0],
      Body: request.file.buffer,
    });

    await s3Client.send(s3Command);
  }

  const document = await Post.create({ user: userId, text, images });

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

export const getPost = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
  const { params } = request;
  const { id: postId } = params;

  const document = await Post.findById(postId)
    .populate({
      path: 'user',
      select: 'name',
    })
    .populate({
      path: 'likes',
      select: 'name',
    }).sort({ addedAt: -1 })
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

export const getAllPosts = catchAsync(async (_: Request, response: Response) => {
  const documents = await Post.find()
    .populate({
      path: 'user',
      select: 'name',
    })
    .populate({
      path: 'likes',
      select: 'name',
    }).sort({ addedAt: -1 })
    .select('-__v');

  response.status(200).json({
    status: STATUS_SUCCESS,
    results: documents.length,
    data: {
      data: documents,
    },
  });
});