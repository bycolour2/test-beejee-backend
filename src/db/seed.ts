import { db } from "@/db";
import { env } from "@/env";
import * as seeds from "@/db/seeds";

async function seed() {
  if (!env.DB_SEEDING) {
    throw new Error('You must set DB_SEEDING to "true" when running seeds');
  }

  try {
    await seeds.users(db);
  } catch (err) {
    console.error("Unknown error seeding database:", err);
  }
}

seed();
