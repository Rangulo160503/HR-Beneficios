// src/services/apiBase.js

const CLOUD_FALLBACK = "https://hr-beneficios-api-grgmckc5dwdca9dc.canadacentral-01.azurewebsites.net";
const LOCAL_FALLBACK = "https://localhost:5001";

const target = import.meta.env.VITE_API_TARGET?.trim().toLowerCase() || "local";

const cloudBase = import.meta.env.VITE_API_BASE_CLOUD || CLOUD_FALLBACK;
const localBase = import.meta.env.VITE_API_BASE || LOCAL_FALLBACK;

export const API_BASE = (target === "local" ? localBase : cloudBase)?.replace(/\/+$/, "") || "";

export const API_TARGET = target;
export const getApiBase = () => API_BASE;

export default API_BASE;
