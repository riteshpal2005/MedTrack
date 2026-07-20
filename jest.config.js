module.exports = {
  preset: '@react-native/jest-preset', // <-- CHANGE THIS LINE
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|@nozbe/watermelondb)/',
  ],
};
