module.exports = {
  preset: '@react-native/jest-preset', // <-- CHANGE THIS LINE
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', '<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|@nozbe/watermelondb)/',
  ],
};
