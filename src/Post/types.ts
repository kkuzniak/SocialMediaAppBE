import { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  user: typeof Schema.ObjectId;
  text: string;
  images: [string];
  likes: [Schema.Types.ObjectId];
  addedAt: Date;
  updatedAt: Date;
}