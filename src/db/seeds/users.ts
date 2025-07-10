import users from "./data/users.json";

import type { DB } from "@/db";
import { hashText } from "@/utils/hash-text";
import * as schema from "@/db/schema";

export default async function seed(db: DB) {
  for (const user of users) {
    await db
      .insert(schema.users)
      .values({
        username: user.username,
        password: hashText(user.password),
      })
      .returning();
  }
}
