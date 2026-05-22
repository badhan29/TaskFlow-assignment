import Project from "../models/project.model.js";
import Task from "../models/task.model.js";

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
      description: description || "",
      createdBy: req.user._id,
    });

    res
      .status(201)
      .json({ success: true, message: "Project created", project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this project",
      });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Project and its tasks deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
