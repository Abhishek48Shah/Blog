import { Request, Response, NextFunction } from "express";
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promiss<any>;
export default (execution: AsyncFunction) => (req, res, next) => {
  execution(req, res, next).catch(next);
};
