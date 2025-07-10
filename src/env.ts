import { z } from "zod/v4";

const stringBoolean = z.coerce
  .string()
  .default("false")
  .transform((val) => {
    return val === "true";
  });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DB_FILE_NAME: z.string().default("file:drizzle.db"),
  DB_SEEDING: stringBoolean,
  SECRET_KEY: z.string().default("secret"),
});

try {
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(
      "Missing environment variables:",
      error.issues.flatMap((issue) => issue.path),
    );
  } else {
    console.error(error);
  }
  process.exit(1);
}

export const env = envSchema.parse(process.env);
