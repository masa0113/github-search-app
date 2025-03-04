import nextJest from "next/jest";
import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: ".",
});

const customJestConfig: Config = {
  roots: ["<rootDir>/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["browser", "node"],
  },
  collectCoverageFrom: ["./src/**/*.{ts,tsx}"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
};

export default createJestConfig(customJestConfig);
