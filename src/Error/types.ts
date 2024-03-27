/**
 * Global API error returned from the endpoints
 */
export class ApiError extends Error {
  statusCode: number;
  status: 'fail' | 'error';
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational?: boolean) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational !== undefined ? isOperational : true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export type MongooseErrorKeyValue = Record<string, string>;

export interface MongooseDuplicateFieldsError extends Error {
  code: number;
  keyValue: MongooseErrorKeyValue;
}

interface MongooseValidationErrorItem {
  message: string;
}

export interface MongooseValidationError extends Error {
  code: number;
  errors: MongooseValidationErrorItem[];
}

export interface JsonWebTokenError extends Error {
  name: 'JsonWebTokenError'
}

export interface JsonWebTokenExpiredError extends Error {
  name: 'TokenExpiredError'
}

export interface LimitUnexpectedFileError extends Error {
  code: 'LIMIT_UNEXPECTED_FILE';
}