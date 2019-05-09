module.exports = {
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  setupFilesAfterEnv: ['react-testing-library/cleanup-after-each'],
  testMatch: ['**/**/*.test.ts', '**/**/*.test.tsx'],
  coveragePathIgnorePatterns: ['node_modules', 'coverage', 'jest.config.js'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['./src/lib/**/*.{ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
