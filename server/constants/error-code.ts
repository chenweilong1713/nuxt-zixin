// server/constants/error-code.ts
export const ErrorCode = {
  PARAM_INVALID: 'PARAM_INVALID',
  OPERATION_FAILED: 'OPERATION_FAILED',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND'
} as const;

export type ErrorCodeType = keyof typeof ErrorCode;