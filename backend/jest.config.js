const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  testMatch: [
    "**/tests/**/*.ts",
    "**/?(*.)+(spec|test).ts"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};