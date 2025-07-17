import type { Response } from "express";
import {
  NotFoundResponse,
  BadRequestResponse,
  InternalErrorResponse,
  AuthFailureResponse,
  ForbiddenResponse,
} from "./apiResponse";
export enum ErrorType {
  NOT_FOUND = "NotFound",
  INTERNAL_ERROR = "InternalServerError",
  BAD_REQUEST = "BadRequest",
  AUTH_FAILURE = "AuthFailureError",
  FORBIDDEN = "ForbiddenError",
  UNAUTHORIZED = "UnauthorizedError",
}
export class ApiError extends Error {
  constructor(
    public message: string,
    public types: ErrorType,
  ) {
    super(message);
  }
  public static handleError(err: ApiError, res: Response) {
    switch (err.types) {
      case ErrorType.NOT_FOUND:
        return new NotFoundResponse(err.message).send(res);
      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(err.message).send(res);
      case ErrorType.FORBIDDEN:
        return new ForbiddenResponse(err.message).send(res);
      case ErrorType.UNAUTHORIZED:
      case ErrorType.AUTH_FAILURE:
        return new AuthFailureResponse(err.message).send(res);
      default:
        return new InternalErrorResponse(err.message).send(res);
    }
  }
}
export class NotFoundError extends ApiError {
  constructor(
    message: string = "Not found",
    types: ErrorType = ErrorType.NOT_FOUND,
  ) {
    super(message, types);
  }
}
export class BadRequestError extends ApiError {
  constructor(
    message: string = "Bad request",
    types: ErrorType = ErrorType.BAD_REQUEST,
  ) {
    super(message, types);
  }
}
export class ForbiddenError extends ApiError {
  constructor(
    message: string = "Forbidden",
    types: ErrorType = ErrorType.FORBIDDEN,
  ) {
    super(message, types);
  }
}
export class UnAuthorizedError extends ApiError {
  constructor(
    message: string = "Unauthorized access",
    types: ErrorType = ErrorType.UNAUTHORIZED,
  ) {
    super(message, types);
  }
}
export class InternalError extends ApiError {
  constructor(
    message: string = "Internal server error, Please try again later",
    types: ErrorType = ErrorType.INTERNAL_ERROR,
  ) {
    super(message, types);
  }
}
export class AuthFailureError extends ApiError {
  constructor(
    message: string = "Auth failure error",
    types: ErrorType = ErrorType.AUTH_FAILURE,
  ) {
    super(message, types);
  }
}
