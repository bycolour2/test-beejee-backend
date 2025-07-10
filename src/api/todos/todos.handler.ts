import type { RequestHandler } from "express";
import { eq, sql } from "drizzle-orm";

import type { Todo } from "@/db/schema";
import type ErrorResponse from "@/interfaces/error-response";
import type MessageResponse from "@/interfaces/message-response";
import type PaginatedResponse from "@/interfaces/paginated-response";
import { db } from "@/db";
import { insertTodosSchema, patchTodosSchema, todos } from "@/db/schema";

type TodosRouteQueryParams = {
  page?: string;
  pageSize?: string;

  sort?: "author" | "email" | "completed";
  order?: "asc" | "desc";
};

export const getAllTodos: RequestHandler<
  {},
  PaginatedResponse<Todo[]> | ErrorResponse,
  any,
  TodosRouteQueryParams
> = async (req, res) => {
  const page = Number.parseInt(req.query.page as string) || 1;
  const pageSize = Number.parseInt(req.query.pageSize as string) || 3;
  try {
    const offset = (page - 1) * pageSize;

    const sortBy = req.query.sort;
    const sortOrder = req.query.order || "asc";

    const allTodos = await db.query.todos.findMany({
      limit: pageSize,
      offset,
      orderBy: (todos, { asc, desc }) => {
        const sortStrategy = sortOrder === "asc" ? asc : desc;
        if (sortBy === "author") {
          return sortStrategy(todos.author);
        } else if (sortBy === "email") {
          return sortStrategy(todos.email);
        } else if (sortBy === "completed") {
          return sortStrategy(todos.completed);
        } else {
          return desc(todos.id);
        }
      },
    });
    const totalCount = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(todos);

    res.json({ data: allTodos, page, pageSize, count: totalCount[0].count });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal server error" } as ErrorResponse);
  }
};

export const getTodoById: RequestHandler<{ id: string }, Todo | ErrorResponse> = async (
  req,
  res,
) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid ID format" } as ErrorResponse);
      return;
    }

    const todo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);

    if (todo.length === 0) {
      res.status(404).json({ message: "Todo not found" } as ErrorResponse);
      return;
    }

    res.json(todo[0]);
  } catch (error) {
    console.error("Error fetching todo:", error);
    res.status(500).json({ message: "Internal server error" } as ErrorResponse);
  }
};

export const createTodo: RequestHandler = async (req, res) => {
  try {
    const validatedData = insertTodosSchema.safeParse(req.body);

    if (!validatedData.success) {
      res.status(400).json({
        message: "Invalid todo data",
      } as ErrorResponse);
      return;
    }

    const newTodo = await db.insert(todos).values(validatedData.data).returning();
    res.status(201).json(newTodo[0]);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ message: "Internal server error" } as ErrorResponse);
  }
};

export const updateTodo: RequestHandler = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid ID format" } as ErrorResponse);
      return;
    }

    const validatedData = patchTodosSchema.safeParse(req.body);

    if (!validatedData.success) {
      res.status(400).json({
        message: "Invalid todo data",
      } as ErrorResponse);
      return;
    }

    const [todo] = await db.select().from(todos).where(eq(todos.id, id)).limit(1);

    if (!todo) {
      res.status(404).json({ message: "Todo not found" } as ErrorResponse);
      return;
    }

    const updatedTodo = await db
      .update(todos)
      .set({
        ...validatedData.data,
        updatedByAdmin: validatedData.data.description !== todo.description,
      })
      .where(eq(todos.id, id))
      .returning();

    if (updatedTodo.length === 0) {
      res.status(404).json({ message: "Todo not found" } as ErrorResponse);
      return;
    }

    res.json(updatedTodo[0]);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Internal server error" } as ErrorResponse);
  }
};

export const deleteTodo: RequestHandler = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid ID format" } as MessageResponse);
      return;
    }

    const deletedTodo = await db.delete(todos).where(eq(todos.id, id)).returning();

    if (deletedTodo.length === 0) {
      res.status(404).json({ message: "Todo not found" } as MessageResponse);
      return;
    }

    res.json({ message: "Todo deleted successfully" } as MessageResponse);
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Internal server error" } as MessageResponse);
  }
};
