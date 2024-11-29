module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    transform: {
      '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
    },
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.html$': '<rootDir>/html.mock.js',
    },
    moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  };