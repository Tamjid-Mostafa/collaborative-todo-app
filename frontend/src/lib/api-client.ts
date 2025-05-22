import axios from "axios";
import { useAuthStore } from "./stores/auth";

export const useApi = () => {
  const { token } = useAuthStore.getState();

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
};