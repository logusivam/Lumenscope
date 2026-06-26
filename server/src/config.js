import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sharedConfig = {};
try {
  // Config path is located at the root of the project workspace
  const sharedConfigPath = path.resolve(__dirname, '../../shared/config.json');
  if (fs.existsSync(sharedConfigPath)) {
    sharedConfig = JSON.parse(fs.readFileSync(sharedConfigPath, 'utf8'));
  }
} catch (error) {
  console.warn('Could not load shared config.json:', error.message);
}

export const BACKEND_URL = process.env.BACKEND_URL || sharedConfig.backendUrl || 'http://localhost:3001';
export const FRONTEND_URL = process.env.FRONTEND_URL || sharedConfig.frontendUrl || 'http://localhost:5173';
