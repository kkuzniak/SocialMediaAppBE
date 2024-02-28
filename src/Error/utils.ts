import { JsonWebTokenError } from 'jsonwebtoken';

import { JsonWebTokenExpiredError, MongooseDuplicateFieldsError, MongooseValidationError } from './types';

/**
 * A type guard function to check if the unknown error is of the Error type
 *
 * @param error - Error
 * @returns true when the error is of the Error type, false when it's not
 */
export const isStandardError = (error: unknown): error is Error => {
  if (
    typeof error === 'object' &&
    'name' in error &&
    typeof error.name === 'string' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return true;
  }

  return false;
};

/**
 * A type guard function to check if the unknown error is of the MongooseDuplicateFieldsError type
 *
 * @param error - Error
 * @returns true when the error is of the MongooseDuplicateFieldsError type, false when it's not
 */
export const isMongooseDuplicateFieldsError = (error: unknown): error is MongooseDuplicateFieldsError => {
  if (
    isStandardError(error) &&
    typeof error === 'object' &&
    'keyValue' in error &&
    typeof error.keyValue === 'object' &&
    'code' in error &&
    typeof error.code === 'number' &&
    error.code === 11000
  ) {
    return true;
  }

  return false;
};

/**
 * A type guard function to check if the unknown error is of the MongooseValidationError type
 *
 * @param error - Error
 * @returns true when the error is of the MongooseValidationError type, false when it's not
 */
export const isMongooseValidationError = (error: unknown): error is MongooseValidationError => {
  if (
    isStandardError(error) &&
    typeof error === 'object' &&
    'errors' in error &&
    typeof error.errors === 'object' &&
    Object.values(error.errors).every(value =>
      typeof value === 'object' &&
      'message' in value &&
      typeof value.message === 'string',
    )
  ) {
    return true;
  }

  return false;
};

/**
 * A type guard function to check if the unknown error is of the JsonWebTokenError type
 *
 * @param error - Error
 * @returns true when the error is of the JsonWebTokenError type, false when it's not
 */
export const isJsonWebTokenError = (error: unknown): error is JsonWebTokenError => {
  if (isStandardError(error) && error.name === 'JsonWebTokenError') {
    return true;
  }

  return false;
};

/**
 * A type guard function to check if the unknown error is of the JsonWebTokenExpiredError type
 *
 * @param error - Error
 * @returns true when the error is of the JsonWebTokenExpiredError type, false when it's not
 */
export const isJsonWebTokenExpiredError = (error: unknown): error is JsonWebTokenExpiredError => {
  if (isStandardError(error) && error.name === 'TokenExpiredError') {
    return true;
  }

  return false;
};