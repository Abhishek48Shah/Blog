import type { Response } from "express";
enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
  AUTH_FAILURE_ERROR = 401,
  FORBIDDEN_ERROR = 403,
}
interface ResponseShape {
  message: string;
  data?: any;
  status: ResponseStatus;
}
abstract class ApiResponse {
  constructor(
    public message: string,
    public status: ResponseStatus,
  ) {}
  protected process<T extends ResponseShape>(res: Response, response: T) {
    return res.status(this.status).json(this.sanitize(response));
  }
  send(res: Response) {
    return this.process(res, this);
  }
  private sanitize<T extends ResponseShape>(response: T) {
    let clone: Record<string, any> = { ...response };
    delete clone.status;
    for (const i in clone)
      if (typeof (clone as any)[i] === "undefined") delete (clone as any)[i];
    return clone;
  }
}
export class InternalErrorResponse extends ApiResponse {
  constructor(message: string, status: number = ResponseStatus.INTERNAL_ERROR) {
    super(message, status);
  }
}
export class BadRequestResponse extends ApiResponse {
  constructor(message: string, status: number = ResponseStatus.BAD_REQUEST) {
    super(message, status);
  }
}
export class NotFoundResponse extends ApiResponse {
  constructor(message: string, status: number = ResponseStatus.NOT_FOUND) {
    super(message, status);
  }
}
export class AuthFailureResponse extends ApiResponse {
  constructor(
    message: string,
    status: number = ResponseStatus.AUTH_FAILURE_ERROR,
  ) {
    super(message, status);
  }
}
export class ForbiddenResponse extends ApiResponse {
  constructor(
    message: string,
    status: number = ResponseStatus.FORBIDDEN_ERROR,
  ) {
    super(message, status);
  }
}
export class SuccessResponse extends ApiResponse {
  constructor(
    public message: string,
    protected data: any,
    status: number = ResponseStatus.SUCCESS,
  ) {
    super(message, status);
  }
  send(res: Response) {
    return super.process(res, this);
  }
}
export class SuccessMsgResponse extends ApiResponse {
  constructor(message: string, status: number = ResponseStatus.SUCCESS) {
    super(message, status);
  }
}
