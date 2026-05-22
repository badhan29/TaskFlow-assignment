import { toast } from "react-toastify";

export const showError = (error, fallback = "Something went wrong") => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    error?.toString?.() ||
    fallback;
  toast.error(message);
  return message;
};

export const showSuccess = (message) => {
  toast.success(message);
};
