import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  // Match all apps and packages
  "apps/*/vitest.config.{e2e,unit}.ts",
  "packages/*/vitest.config.{e2e,unit}.ts",
  // Root level tests
  {
    test: {
      name: "root",
      include: ["**/*.{test,spec}.{js,ts}"],
      exclude: ["**/node_modules/**", "**/dist/**", "apps/**", "packages/**"],
    },
  },
]);
