import API from "./project.api";

// CREATE TASK
export const createTask = (data) => {
  return API.post("/tasks", data);
};

// GET TASKS BY PROJECT
export const getTasksByProject = (projectId) => {
  return API.get(`/tasks/project/${projectId}`);
};

// GET SINGLE TASK
export const getTask = (id) => {
  return API.get(`/tasks/${id}`);
};

// UPDATE TASK
export const updateTask = (id, data) => {
  return API.put(`/tasks/${id}`, data);
};

// DELETE TASK
export const deleteTask = (id) => {
  return API.delete(`/tasks/${id}`);
};