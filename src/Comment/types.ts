import { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  post: Schema.Types.ObjectId;
  text: string;
  likes: [string];
  addedAt: Date;
  updatedAt: Date;
}

export enum ToggleLikeActionType {
  like = 'like',
  unlike = 'unlike',
}
