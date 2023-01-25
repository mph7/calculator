export default {
    moduleNameMapper: {
        "\\.(css|less)$": "<rootDir>/test/mocks/styleMock.js",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    collectCoverageFrom: ["<rootDir>/src/**/*.{js,jsx}", "!<rootDir>/src/main.jsx"],
};
