import { Schema, model } from 'mongoose';

import { IComment } from './types';
import { REQUIRED_ERROR } from './strings';

const commentSchema = new Schema<IComment>({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  text: {
    type: String,
    required: [true, REQUIRED_ERROR.text],
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

export const Comment = model<IComment>('Comment', commentSchema);
