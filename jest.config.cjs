const nextJest = require("next/jest")

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
})

// Add any custom config to be passed to Jest
/** @type {import("jest").Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias" to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: [
    "src/modules/*.js",
    "src/modules/**/*.js",
    
    "!src/**/constants.js",
    "!src/**/config.js",
    "!src/**/*Config.js",
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60,
    },
  },
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/scss/(.*)$": "<rootDir>/src/scss/$1",
    "^@/pages/(.*)$": "<rootDir>/src/pages-lib/$1",
    "^@/data/(.*)$": "<rootDir>/src/data/$1",
    "^@/modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@/testUtils/(.*)$": "<rootDir>/src/testUtils/$1",
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)