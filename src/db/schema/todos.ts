import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  description: text("description").notNull(),
  author: text("author").notNull(),
  email: text("email").notNull(),
  completed: integer({ mode: "boolean" }).notNull().default(false),
  updatedByAdmin: integer({ mode: "boolean" }).notNull().default(false),
});

export const selectTasksSchema = createSelectSchema(todos);

export const insertTodosSchema = createInsertSchema(todos, {
  description: (schema) => schema.min(1).max(500),
  author: (schema) => schema.min(1).max(50),
  email: (schema) => schema.email(),
})
  .required({
    description: true,
    author: true,
    email: true,
  })
  .omit({
    completed: true,
    id: true,
    updatedByAdmin: true,
  });

export const patchTodosSchema = createInsertSchema(todos, {
  description: (schema) => schema.min(1).max(500),
}).omit({
  author: true,
  email: true,
  id: true,
  updatedByAdmin: true,
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
