import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, project } = req.body;

    if (!title || !project) {
      return res.status(400).json({
        success: false,
        message: "Title and project are required",
      });
    }

    // Make sure the project belongs to the logged-in user
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    if (projectDoc.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "medium",
      project,
      createdBy: req.user._id,   // FIX: save the owner
    });

    res.status(201).json({
      success: true,
      data: task,
      message: "Task created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET TASKS BY PROJECT — only owner can see
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // FIX: only the project owner can fetch its tasks
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this project's tasks",
      });
    }

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE TASK — only owner
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("project", "title");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // FIX: ownership check
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE TASK — only owner; only allow safe fields
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // FIX: this used to crash because task.createdBy didn't exist in the model
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    // FIX: only allow these fields to be updated (never let status/owner be injected freely)
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const allowedUpdates = {};
    if (title !== undefined) allowedUpdates.title = title;
    if (description !== undefined) allowedUpdates.description = description;
    if (status !== undefined) allowedUpdates.status = status;
    if (priority !== undefined) allowedUpdates.priority = priority;
    if (dueDate !== undefined) allowedUpdates.dueDate = dueDate;
    if (assignedTo !== undefined) allowedUpdates.assignedTo = assignedTo;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE TASK — only owner
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};