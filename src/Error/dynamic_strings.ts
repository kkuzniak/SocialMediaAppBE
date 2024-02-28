export const duplicateFieldsErrorMessage = (numberOfFields: number, joinedFailedFields: string) =>
  `Duplicate field value${numberOfFields > 1 ? 's' : ''}: ${joinedFailedFields}. Please use another value.`;

export const validationDatabaseErrorMessage = (errorMessages: string[]) =>
  `Invalid input data. ${errorMessages.join('. ')}.`;