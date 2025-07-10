import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  accessToken: text("access_token"),
});

export const selectUsersSchema = createSelectSchema(users);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type TokenInfo = {
  userId: number;
  username: string;
  iat: number;
};
export type UserBasicInfo = {
  id: number;
  username: string;
};
