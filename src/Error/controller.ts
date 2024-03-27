import { NextFunction, Request, Response } from 'express';

import { ApiError, MongooseErrorKeyValue, MongooseValidationError } from './types';
import {
  isApiError,
  isJsonWebTokenError,
  isJsonWebTokenExpiredError,
  isLimitUnexpectedFileError,
  isMongooseDuplicateFieldsError,
  isMongooseValidationError,
} from './utils';
import { duplicateFieldsErrorMessage, validationDatabaseErrorMessage } from './dynamic_strings';
import {
  INVALID_TOKEN,
  ONE_FILE_REQUIRED,
  SOMETHING_WENT_WRONG,
  THE_TOKEN_HAS_EXPIRED,
} from './strings';

const handleDuplicateFieldsError = (keyValue: MongooseErrorKeyValue) => {
  const failedFields = Object.keys(keyValue);
  const joinedFailedFields = failedFields.join(', ');

  const message = duplicateFieldsErrorMessage(failedFields.length, joinedFailedFields);

  return new ApiError(message, 400);
};

const handleValidationDatabaseError = (error: MongooseValidationError) => {
  const errors = Object.values(error.errors).map(({ message }) => message);

  const message = validationDatabaseErrorMessage(errors);

  return new ApiError(message, 400);
};

const handleJsonWebTokenError = () => new ApiError(INVALID_TOKEN, 401);

const handleJsonWebTokenExpiredError = () => new ApiError(THE_TOKEN_HAS_EXPIRED, 401);

const handleLimitUnexpectedFile = () => new ApiError(ONE_FILE_REQUIRED, 400);

const sendError = (error: unknown | ApiError, _: Request, response: Response) => {
  if (isApiError(error) && error.isOperational) {
    const { status, statusCode, message } = error;

    return response.status(statusCode).json({
      status,
      message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: SOMETHING_WENT_WRONG,
  });
};

export const handleGlobalErrors = (
  caughtError: unknown | ApiError,
  request: Request,
  response: Response,
  _: NextFunction,
) => {
  let errorResponse;
  console.log('CAUGHT ERROR: ', caughtError);

  if (isMongooseDuplicateFieldsError(caughtError)) {
    errorResponse = handleDuplicateFieldsError(caughtError.keyValue);
  }

  if (isMongooseValidationError(caughtError)) {
    errorResponse = handleValidationDatabaseError(caughtError);
  }

  if (isJsonWebTokenError(caughtError)) {
    errorResponse = handleJsonWebTokenError();
  }

  if (isJsonWebTokenExpiredError(caughtError)) {
    errorResponse = handleJsonWebTokenExpiredError();
  }

  if (isLimitUnexpectedFileError(caughtError)) {
    errorResponse = handleLimitUnexpectedFile();
  }

  return sendError(errorResponse || caughtError, request, response);
};