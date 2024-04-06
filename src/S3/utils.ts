import { S3Client } from '@aws-sdk/client-s3';
import { ObjectId } from 'mongoose';
import { v4 as uuid } from 'uuid';
import path from 'path';

export const getS3Client = () =>
  new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

export const getUserImageFilePath = (
  userId: ObjectId,
  file: Express.Multer.File,
) => {
  const stringifiedUserId = userId.toString();
  const filename = uuid();
  const extension = path.extname(file.originalname);

  return `${stringifiedUserId}/${filename}${extension}`;
};
