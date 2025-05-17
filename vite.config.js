// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/craze-blend-ratio/', // example: '/coffee-blend-app/'
  plugins: [react()],
});
