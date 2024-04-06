import { Schema, model } from 'mongoose';

import { IPost } from './types';
import { REQUIRED_ERROR } from './strings';

const postSchema = new Schema<IPost>({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, REQUIRED_ERROR.user],
  },
  text: {
    type: String,
    required: [true, REQUIRED_ERROR.text],
  },
  images: {
    type: [String],
    default: [],
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  addedAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Post = model<IPost>('Post', postSchema);
