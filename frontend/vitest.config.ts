import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // <-- CRUCIAL: Simulates the browser DOM (document, window)
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});