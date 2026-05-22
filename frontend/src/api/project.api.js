import axios from "axios";

const API = axios.create({
  baseURL: "https://taskflow-assignment-fx4p.onrender.com/api",
});

// ADD TOKEN
API.interceptors.request.use((req) => {
  const storedUserInfo = localStorage.getItem("userInfo");
  const parsedUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
  const token = parsedUserInfo?.token || localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;