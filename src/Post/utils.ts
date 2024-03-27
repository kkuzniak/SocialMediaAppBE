import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import path from 'path';

import { ApiError } from '../Error/types';
import { MAXIMUM_SIZE_OF_THE_FILE, THE_FILE_IS_NOT_AN_IMAGE } from './strings';

const POST_IMAGE_REQUIRED_FILE_TYPES = /jpeg|jpg|png/;
const MAX_FILE_SIZE_IN_BYTES = 100000;

export const postImageFilter = (request: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  const extension = POST_IMAGE_REQUIRED_FILE_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimetype = POST_IMAGE_REQUIRED_FILE_TYPES.test(file.mimetype);
  const fileSize = +request.headers['content-length'];

  if (!extension || !mimetype) {
    callback(
      new ApiError(THE_FILE_IS_NOT_AN_IMAGE, 400),
    );

    return;
  }

  if (fileSize > MAX_FILE_SIZE_IN_BYTES) {
    callback(
      new ApiError(MAXIMUM_SIZE_OF_THE_FILE, 400),
    );

    return;
  }

  callback(null, true);
};