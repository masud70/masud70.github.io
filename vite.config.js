import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// "/" for a root user site (masud70.github.io).
// "/repo-name/" for a project site. Set via the BASE_PATH env var in CI.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
});
