import express from "express";
import type { Request, Response, NextFunction } from "express";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index";
import logger from "./core/logger";
import { ApiError, InternalError } from "./core/apiError";
const app = express();
app.use(pinoHttp({ logger }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors());
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
