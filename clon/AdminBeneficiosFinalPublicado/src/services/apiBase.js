// src/services/apiBase.js

const target = import.meta.env.VITE_API_TARGET?.trim().toLowerCase() || "local";

export const API_BASE = (
  target === "cloud"
    ? import.meta.env.VITE_API_BASE_CLOUD
    : import.meta.env.VITE_API_BASE
)?.replace(/\/+$/, "") || "";

export const API_TARGET = target;
export const getApiBase = () => API_BASE;

export default API_BASE;
