import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["dist/**", "node_modules/**"],
    pool: "forks",
    testTimeout: 60_000,
    hookTimeout: 60_000
  }
});
