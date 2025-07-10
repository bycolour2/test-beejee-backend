import express from "express";

import * as handlers from "./todos.handler";

import * as middlewares from "@/middlewares";

const router = express.Router();

router.get("/", handlers.getAllTodos);
router.get("/:id", handlers.getTodoById);
router.post("/", handlers.createTodo);
router.patch("/:id", middlewares.checkAuth, handlers.updateTodo);
router.delete("/:id", middlewares.checkAuth, handlers.deleteTodo);

export default router;
