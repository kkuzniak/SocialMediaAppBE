import { Router } from 'express';

import { addLike, createPost, updatePost } from './controller';
import { protect } from '../Auth/controller';

const postRouter = Router();

postRouter.route('/').post(protect, createPost);
postRouter.route('/:id').patch(protect, updatePost);

postRouter.route('/:id/like').patch(protect, addLike);

export default postRouter;
