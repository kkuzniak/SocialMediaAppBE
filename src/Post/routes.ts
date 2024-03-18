import { Router } from 'express';

import { createPost, deletePost, getAllPosts, getPost, toggleLike, updatePost, uploadPostImage } from './controller';
import { protect } from '../Auth/controller';
import { ToggleLikeActionType } from './types';

const postRouter = Router();

postRouter.route('/')
  .get(protect, getAllPosts)
  .post(protect, uploadPostImage, createPost);
postRouter.route('/:id')
  .get(protect, getPost)
  .patch(protect, updatePost)
  .delete(protect, deletePost);

postRouter.route('/:id/like').patch(protect, toggleLike(ToggleLikeActionType.like));
postRouter.route('/:id/unlike').patch(protect, toggleLike(ToggleLikeActionType.unlike));

export default postRouter;
