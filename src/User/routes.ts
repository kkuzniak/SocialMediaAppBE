import { Router } from 'express';

import { login, logout, signup } from '../Auth/controller';
import { getUsers } from './controller';

const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/logout', logout);

userRouter.route('/').get(getUsers);

export default userRouter;