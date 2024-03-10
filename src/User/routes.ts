import { Router } from 'express';

import { login, logout, signup } from '../Auth/controller';

const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/logout', logout);

export default userRouter;