import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
// @ts-ignore
import { xss } from 'express-xss-sanitizer';
import hpp from 'hpp';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';

import userRouter from './src/User/routes';
import { handleGlobalErrors } from './src/Error/controller';
import postRouter from './src/Post/routes';
import { ApiError } from './src/Error/types';
import commentRouter from './src/Comment/routes';
import { swaggerSpecification } from './src/Swagger/config';

const app = express();

// app.enable('trust proxy');

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecification));
app.use(cors());
app.options('*', cors());

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use(hpp());

app.use(compression());

app.use('/v1/users', userRouter);
app.use('/v1/posts', postRouter);
app.use('/v1/comments', commentRouter);

app.all('*', (request: Request, _: Response, next: NextFunction) => {
  next(new ApiError(`Cannot find ${request.originalUrl} on this server`, 404));
});

app.use(handleGlobalErrors);

export default app;
