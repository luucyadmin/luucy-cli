import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageReporters: ["cobertura", "lcov", "text"],
  reporters: ["default", ["jest-junit", { outputDirectory: "reports" }]],
};

export default config;
