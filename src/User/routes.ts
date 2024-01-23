import express from 'express';

import { login, logout, signup } from '../Auth/controller.ts';
import { getUsers } from './controller.ts';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/logout', logout);

userRouter.route('/').get(getUsers);

export default userRouter;