import { Schema, model } from 'mongoose';

import { IPost } from './types';

const postSchema = new Schema<IPost>({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'A user must be assigned to the post'],
  },
  text: {
    type: String,
    required: [true, 'Post text cannot be empty'],
  },
  images: {
    type: [String],
    default: [],
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
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