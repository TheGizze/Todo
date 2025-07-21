const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { 
      useESM: true 
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(nanoid)/)'
  ],
  testMatch: [
    "**/tests/**/*.ts",
    "**/?(*.)+(spec|test).ts"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};