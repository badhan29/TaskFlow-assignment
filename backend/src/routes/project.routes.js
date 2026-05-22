import express from "express";

import protect from "../middlewares/auth.middleware.js";

import {
  createProject,
  getProjects,
  deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", protect, createProject);

router.get("/", protect, getProjects);

router.delete("/:id", protect, deleteProject);

export default router;