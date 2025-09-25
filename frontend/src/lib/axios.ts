import axios from "axios";

import { getSession } from "next-auth/react";

import { NEXT_PUBLIC_BASE_API_URL } from "./constants/app";

const api = axios.create({
  baseURL: NEXT_PUBLIC_BASE_API_URL() ?? "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session) {
      config.headers["Authorization"] = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response.data || error.message)
);

export default api;
