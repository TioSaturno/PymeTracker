import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globalSetup: ["../../shared/test/globalSetup.ts"],
    setupFiles: ["./test/setup.ts"],
    fileParallelism: false,
    coverage: {
      reporter: ["text"],
      exclude: [
        "**/node_modules/**",
        "**/.next/**",
        "**/test/**",
        "**/migrations/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
