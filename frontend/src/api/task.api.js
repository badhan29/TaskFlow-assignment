import API from "./project.api";

export const createTask = (data) => {
  return API.post("/tasks", data);
};

export const getTasksByProject = (projectId) => {
  return API.get(`/tasks/project/${projectId}`);
};

export const getTask = (id) => {
  return API.get(`/tasks/${id}`);
};

export const updateTask = (id, data) => {
  return API.put(`/tasks/${id}`, data);
};

export const deleteTask = (id) => {
  return API.delete(`/tasks/${id}`);
};
