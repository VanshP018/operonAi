// API configuration based on environment
// In production, use the same domain as the frontend
// In development, use localhost:3000
const isDevelopment = import.meta.env.MODE === 'development' || !import.meta.env.PROD;

export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (isDevelopment ? "http://localhost:3000" : window.location.origin);

export const API_KEY = import.meta.env.VITE_API_KEY || "key_abc";

export const COMPANY_ID = import.meta.env.VITE_COMPANY_ID || "comp_123";
