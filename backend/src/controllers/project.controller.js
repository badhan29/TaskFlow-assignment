import Project from "../models/project.model.js";
import Task from "../models/task.model.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const project = await Project.create({
      title,
      description: description || "",   // FIX: description was required in schema but frontend may omit it
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Project created", project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL PROJECTS — only the logged-in user's projects
export const getProjects = async (req, res) => {
  try {
    // FIX: filter by createdBy so users only see their own projects
    const projects = await Project.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE PROJECT — only the owner, also deletes all tasks inside
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // FIX: was missing — any logged-in user could delete anyone's project
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this project",
      });
    }

    // FIX: also clean up all tasks belonging to this project
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.status(200).json({ success: true, message: "Project and its tasks deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};