import api from "../utils/axios";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/reigister", userData);
  return response.data;
}

export const verifyAccountOTP = async (otpData) => {
  const response = await api.post("/auth/verify-otp", otpData);
  return response.data;
}

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
}

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
}

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
}