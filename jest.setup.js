/* eslint-env jest */
jest.mock('@notifee/react-native', () => ({
  requestPermission: jest.fn(),
  createChannel: jest.fn(),
  createTriggerNotification: jest.fn(),
  cancelNotification: jest.fn(),
  TriggerType: { TIMESTAMP: 0 },
  RepeatFrequency: { DAILY: 'DAILY' },
  AndroidImportance: { HIGH: 4 },
}));

jest.mock('@nozbe/watermelondb', () => ({
  Database: jest.fn().mockImplementation(() => ({
    write: jest.fn(async (cb) => cb()),
    collections: {
      get: jest.fn(),
    },
  })),
  Model: class Model {
    id = 'test-id';
    markAsDeleted = jest.fn();
    update = jest.fn(async (cb) => cb(this));
  },
  tableSchema: jest.fn(),
  appSchema: jest.fn(),
  Q: jest.fn(),
}));

jest.mock('@nozbe/watermelondb/adapters/sqlite', () => {
  return class SQLiteAdapter {
    constructor() {
      this.schema = {};
    }
  };
});
