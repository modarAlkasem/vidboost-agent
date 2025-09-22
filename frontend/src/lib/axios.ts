import axios from "axios";

import { NEXT_PUBLIC_BASE_API_URL } from "./constants/app";

const api = axios.create({
  baseURL: NEXT_PUBLIC_BASE_API_URL() ?? "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
