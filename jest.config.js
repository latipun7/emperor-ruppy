const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { defaults: tsJest } = require('ts-jest/presets');

/**
 * @type {import('./tsconfig.json')}
 */
const { compilerOptions } = require('./tsconfig.json');

/** @typedef {import('ts-jest')} */
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: '@shelf/jest-mongodb',
  testTimeout: 15000,
  moduleDirectories: ['node_modules', '<rootDir>'],
  verbose: true,
  collectCoverage: true,
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/tests/test.setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/index.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/dist/**',
  ],
  // coverageThreshold: {
  //   global: {
  //     branches: 75,
  //     functions: 75,
  //     lines: 75,
  //     statements: 75,
  //   },
  // },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/dist'],
  transform: tsJest.transform,
  globals: {
    'ts-jest': {},
  },
};
