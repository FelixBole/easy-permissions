module.exports = {
	testEnvironment: "node",
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
	clearMocks: true,

	// Configure Jest to use ts-jest for TypeScript files
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx)"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
	coverageDirectory: "coverage",
	coverageReporters: ["json", "lcov", "text", "clover"],
};
