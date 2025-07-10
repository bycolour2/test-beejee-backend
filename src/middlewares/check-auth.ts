import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

import type { TokenInfo, UserBasicInfo } from "@/db/schema";
import type ErrorResponse from "@/interfaces/error-response";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { env } from "@/env";

declare global {
  namespace Express {
    interface Request {
      user?: UserBasicInfo;
    }
  }
}

export async function checkAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).send({ message: "Unauthorized" } as ErrorResponse);
      return;
    }

    const decoded = jwt.verify(token, env.SECRET_KEY) as TokenInfo;

    const user = await db.select().from(users).where(eq(users.id, decoded.userId));

    if (user.length === 0 || user[0].accessToken !== token) {
      res.status(401).send({ message: "Unauthorized" } as ErrorResponse);
      return;
    }

    req.user = { id: decoded.userId, username: decoded.username };

    next();
  } catch (_err) {
    res.status(401).send({ message: "Unauthorized" } as ErrorResponse);
  }
}
