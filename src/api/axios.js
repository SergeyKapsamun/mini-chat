import axios from "axios";
import { useRouter } from "vue-router";

// Инстанс аксиоса для API ChatRex
export const $api = axios.create({
  baseURL: "https://test.chatrex.pro",
});

// Установка access-token для API ChatRex
$api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
