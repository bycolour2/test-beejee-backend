import type { RequestHandler } from "express";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

import type ErrorResponse from "@/interfaces/error-response";
import { db } from "@/db";
import { users } from "@/db/schema";
import { env } from "@/env";
import { hashText } from "@/utils/hash-text";

export const login: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.select().from(users).where(eq(users.username, username));

    if (user.length === 0) {
      res.status(401).json({ message: "Unauthorized" } as ErrorResponse);
      return;
    }

    const isPasswordValid = hashText(password) === user[0].password;

    if (!isPasswordValid) {
      res.status(401).json({ message: "Unauthorized" } as ErrorResponse);
      return;
    }

    const accessToken = jwt.sign(
      {
        userId: user[0].id,
        username,
        iat: Math.floor(Date.now() / 1000),
      },
      env.SECRET_KEY,
    );

    await db.update(users).set({ accessToken }).where(eq(users.id, user[0].id));

    res.json({ accessToken });
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

export const me: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    res.json({
      id: user.id,
      username: user.username,
    });
  } catch (error) {
    console.error("Error getting me:", error);
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;

    const user = await db.select().from(users).where(eq(users.id, userId));

    if (user.length === 0 || user[0].accessToken === null) {
      res.status(401).json({ message: "Unauthorized" } as ErrorResponse);
      return;
    }

    await db.update(users).set({ accessToken: null }).where(eq(users.id, user[0].id));

    res.json({ message: "Logged out" });
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
