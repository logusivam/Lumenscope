import sharedConfig from '../../shared/config.json';

export const BACKEND_URL = (import.meta.env.VITE_API_URL as string) || sharedConfig.backendUrl || 'http://localhost:3001';
export const FRONTEND_URL = (import.meta.env.VITE_FRONTEND_URL as string) || sharedConfig.frontendUrl || 'http://localhost:5173';
