module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Crucial: sets the environment to Node
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts']
};