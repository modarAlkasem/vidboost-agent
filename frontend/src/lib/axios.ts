import axios from "axios";

import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";

import { NEXT_PUBLIC_BASE_API_URL } from "./constants/app";
import { NEXT_AUTH_OPTIONS } from "./next-auth/auth-options";

const api = axios.create({
  baseURL: NEXT_PUBLIC_BASE_API_URL() ?? "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    let accessToken;

    // Client-side: Use getSession
    if (typeof window !== "undefined") {
      const session = await getSession();
      accessToken = session?.accessToken;
    } // Server-side: Use getServerSession
    else {
      const session = await getServerSession(NEXT_AUTH_OPTIONS);
      accessToken = session?.accessToken;
    }
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
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
