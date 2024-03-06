import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  photo: string;
  photoBackground: string;
  password: string;
  passwordConfirm: string;
  active: boolean;
  isPasswordCorrect: (passwordToCheck: string, correctPassword: string) => boolean;
}