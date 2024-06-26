import { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  user: Schema.Types.ObjectId;
  text: string;
  images: [string];
  likes: [Schema.Types.ObjectId];
  addedAt: Date;
  updatedAt: Date;
}

export enum ToggleLikeActionType {
  like = 'like',
  unlike = 'unlike',
}
