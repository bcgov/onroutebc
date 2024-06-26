/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import eslint from "vite-plugin-eslint";
import path from "path";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  path.resolve(process.cwd() + "/config/"),
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: [
      "@emotion/react",
      "@emotion/styled",
      "@mui/material/Tooltip"
    ]
  },
  plugins: [
    eslint(),
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          remove: false,
        }), 
      ],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    server: {
      deps: {
        inline: ["vitest-canvas-mock"]
      },
    },
    coverage: {
      reporter: ["text", "html", "lcov"],
      exclude: ["node_modules/", "src/setupTests.ts"],
    },
  },
  build: {
    emptyOutDir: true,
    outDir: "build",
  },
});
