import express from "express";
import {
  createTask,
  getTasksByProject,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/project/:projectId", protect, getTasksByProject);
router.get("/:id", protect, getTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;