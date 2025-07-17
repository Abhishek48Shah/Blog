import express from "express";
import type { Request, Response, NextFunction } from "express";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import router from "./routes/index";
import logger from "./logger";
import { ApiError, InternalError } from "./core/apiError";
const app = express();
app.use(pinoHttp({ logger }));
app.use(express.json());
app.use(cookieParser());
app.use("/", router);
const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    ApiError.handleError(err, res);
  } else {
    logger.error({ err }, "Unhandle error");
    ApiError.handleError(new InternalError(err), res);
  }
};
app.use(errorMiddleware);
export default app;
