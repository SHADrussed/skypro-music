import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const fullCoverage = { statements: 100, branches: 100, functions: 100, lines: 100 };

export default createJestConfig({
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/**/*.test.[jt]s?(x)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  coverageProvider: "v8",
  coverageThreshold: {
    "./src/lib/searchTracks.ts": fullCoverage,
    "./src/lib/filterTracks.ts": fullCoverage,
    "./src/lib/formatDuration.ts": fullCoverage,
    "./src/store/playerSelectors.ts": fullCoverage,
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
});
