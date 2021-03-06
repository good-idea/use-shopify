module.exports = {
  // preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  setupFiles: ['./setupJest.ts'],
  testMatch: ['**/**/*.test.ts', '**/**/*.test.tsx'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'coverage',
    '/__.*__/',
    'jest.config.js',
  ],
  testEnvironment: 'jsdom',
  // collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.{ts,tsx}'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      compilerOptions: {
        strict: false,
      },
    },
  },
}
