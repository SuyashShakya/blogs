// jest.config.js
module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    moduleNameMapper: {
      "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
      "^@/components/(.*)$": "<rootDir>/src/components/$1",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testPathIgnorePatterns: ["<rootDir>/node_modules/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  };