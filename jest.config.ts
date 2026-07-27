import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  // setupFiles removed in Jest 30, import @testing-library/jest-dom in test files directly
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

export default config;
