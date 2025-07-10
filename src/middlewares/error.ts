import type { NextFunction, Request, Response } from "express";

import type ErrorResponse from "@/interfaces/error-response";
import { env } from "@/env";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
