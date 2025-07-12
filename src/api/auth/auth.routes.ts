import { Router } from "express";

import * as handlers from "./auth.handlers";

import * as middlewares from "@/middlewares";

const router = Router();

router.post("/login", handlers.login);
router.get("/me", middlewares.checkAuth, handlers.me);
router.get("/logout", middlewares.checkAuth, handlers.logout);

export default router;
