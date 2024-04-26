import { Router } from 'express';

import { protect } from '../Auth/controller';
import { createComment, toggleLike } from './controller';
import { ToggleLikeActionType } from './types';

const commentRouter = Router();

commentRouter.route('/:postId').post(protect, createComment);

commentRouter
  .route('/:id/like')
  .patch(protect, toggleLike(ToggleLikeActionType.like));
commentRouter
  .route('/:id/unlike')
  .patch(protect, toggleLike(ToggleLikeActionType.unlike));

export default commentRouter;
