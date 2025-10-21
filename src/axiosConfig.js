import axios from "axios";
import authManager from "./authManager";

const apiClient = axios.create({
  baseURL: "/",
});

apiClient.interceptors.request.use((config) => {
  authManager.updateToken();
  const token = authManager.getToken();
  if (token) config.headers.authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;