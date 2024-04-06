import { CallbackWithoutResultAndOptionalError, Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import { IUser } from './types';
import {
  REQUIRED_ERROR,
  VALID_EMAIL_ERROR,
  VALID_PASSWORD_CONFIRM_ERROR,
} from './strings';

/**
 * User schema
 */
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, REQUIRED_ERROR.name],
  },
  email: {
    type: String,
    required: [true, REQUIRED_ERROR.email],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, VALID_EMAIL_ERROR],
  },
  photo: {
    type: String,
    default: '',
  },
  photoBackground: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, REQUIRED_ERROR.password],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, REQUIRED_ERROR.passwordConfirm],
    validate: {
      validator: function (this: IUser, el: string) {
        return el === this.password;
      },
      message: VALID_PASSWORD_CONFIRM_ERROR,
    },
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre(
  'save',
  async function (this: IUser, next: CallbackWithoutResultAndOptionalError) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
  },
);

userSchema.methods.isPasswordCorrect = async function (
  passwordToCheck: string,
  correctPassword: string,
) {
  const result = await bcrypt.compare(passwordToCheck, correctPassword);

  return result;
};

export const User = model<IUser>('User', userSchema);
