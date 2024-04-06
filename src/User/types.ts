import { Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  photoBackground: string;
  password: string;
  passwordConfirm: string;
  active: boolean;
  addedAt: Date;
  updatedAt: Date;
  isPasswordCorrect: (
    passwordToCheck: string,
    correctPassword: string,
  ) => boolean;
}
