export default {
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/src/test/mocks/styleMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
