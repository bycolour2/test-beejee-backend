import express from "express";

import { auth } from "./auth/auth.index.js";
import { todos } from "./todos/todos.index.js";

const router = express.Router();

router.use("/todos", todos);
router.use("/auth", auth);

export default router;
