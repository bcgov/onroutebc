/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
	envDir: '/usr/share/nginx/html/config',
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite config
    define: {
      VITE_DEPLOY_ENVIRONMENT: env.VITE_DEPLOY_ENVIRONMENT,
    },
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
