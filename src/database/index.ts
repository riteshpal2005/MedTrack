import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import Profile from './models/Profile';
import Medicine from './models/Medicine';
import HistoryLog from './models/HistoryLogs';
import HealthRecord from './models/HealthRecord';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: error => {
    console.error('Databse failed to load: ', error);
  }
});

export const database = new Database({
  adapter,
  modelClasses: [
    Profile,
    Medicine,
    HistoryLog,
    HealthRecord,
  ],
});