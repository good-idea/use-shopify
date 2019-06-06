module.exports = {
	automock: false,
	moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
	setupFiles: ['./setupJest.ts'],
	setupFilesAfterEnv: ['@testing-library/react/cleanup-after-each'],
	testMatch: ['**/**/*.test.ts', '**/**/*.test.tsx'],
	coveragePathIgnorePatterns: ['node_modules', 'coverage', '/__.*__/', 'jest.config.js'],
	testEnvironment: 'jsdom',
	collectCoverage: true,
	collectCoverageFrom: ['./src/**/*.{ts,tsx}'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
}
