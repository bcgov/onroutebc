/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/

process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }; // <-
// import.meta.env.VITE_DEPLOY_ENVIRONMENT available here with: process.env.VITE_DEPLOY_ENVIRONMENT

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  plugins: [eslint(), react(), viteTsconfigPaths(), svgrPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
      ],
    },
  },
  build: {
    outDir: 'build',
  },
});
