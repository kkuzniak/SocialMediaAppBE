import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

import { getS3Client } from './utils';

export const S3UploadUserImage = (
  file: Express.Multer.File,
  imagePath: string,
) => {
  const s3Client = getS3Client();

  const s3Command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imagePath,
    Body: file.buffer,
  });

  return s3Client.send(s3Command);
};

export const S3DeleteUserImage = (imagePath: string) => {
  const s3Client = getS3Client();

  const s3Command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imagePath,
  });

  return s3Client.send(s3Command);
};
