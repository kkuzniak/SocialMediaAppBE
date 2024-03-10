import jwt from 'jsonwebtoken';

import { IUser } from './User/types';

declare module 'jsonwebtoken' {
  export interface UserIdJWTPayload extends jwt.JwtPayload {
    id: string;
  }
}

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}