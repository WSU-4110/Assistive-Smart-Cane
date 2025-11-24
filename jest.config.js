module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/app/services', '<rootDir>/app/components'],
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx)',
    '**/?(*.)+(spec|test).(ts|tsx)'
  ],
  collectCoverageFrom: [
    'app/services/**/*.{ts,tsx}',
    'app/components/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};