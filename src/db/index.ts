import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "@/env";
import * as schema from "@/db/schema";

const client = createClient({
  url: env.DB_FILE_NAME,
});

export const db = drizzle(client, {
  schema,
});

export type DB = typeof db;
