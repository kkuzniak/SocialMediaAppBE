import { Router } from 'express';

import { createPost, deletePost, toggleLike, updatePost } from './controller';
import { protect } from '../Auth/controller';
import { ToggleLikeActionType } from './types';

const postRouter = Router();

postRouter.route('/').post(protect, createPost);
postRouter.route('/:id')
  .patch(protect, updatePost)
  .delete(protect, deletePost);

postRouter.route('/:id/like').patch(protect, toggleLike(ToggleLikeActionType.like));
postRouter.route('/:id/unlike').patch(protect, toggleLike(ToggleLikeActionType.unlike));

export default postRouter;
