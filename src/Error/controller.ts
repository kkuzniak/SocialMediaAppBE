import { NextFunction, Request, Response } from 'express';

import { ApiError, MongooseErrorKeyValue, MongooseValidationError } from './types';
import { isJsonWebTokenError, isJsonWebTokenExpiredError, isMongooseDuplicateFieldsError, isMongooseValidationError } from './utils';
import { duplicateFieldsErrorMessage, validationDatabaseErrorMessage } from './dynamic_strings';
import { INVALID_TOKEN, SOMETHING_WENT_WRONG, THE_TOKEN_HAS_EXPIRED } from './strings';

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

const sendError = (error: ApiError, _: Request, response: Response) => {
  const { isOperational, status, statusCode, message } = error;

  if (isOperational) {
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
  caughtError: unknown,
  request: Request,
  response: Response,
  _: NextFunction,
) => {
  let errorResponse = new ApiError('', 500, false);

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

  return sendError(errorResponse, request, response);
};