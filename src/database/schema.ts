import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'profiles',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'created_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: 'medicines',
      columns: [
        { name: 'profile_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'dosage', type: 'string' },
        { name: 'inventory_count', type: 'number' },
        { name: 'warning_level', type: 'number' },
        { name: 'schedule', type: 'string' },
        { name: 'is_archived', type: 'boolean' },
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'history_logs',
      columns: [
        { name: 'medicine_id', type: 'string', isIndexed: true },
        { name: 'profile_id', type: 'string', isIndexed: true },
        { name: 'timestamp', type: 'number' },
        { name: 'scheduled_time', type: 'string' },
        { name: 'status', type: 'string' }, 
      ]
    }),
    tableSchema({
      name: 'health_records',
      columns: [
        { name: 'profile_id', type: 'string', isIndexed: true },
        { name: 'type', type: 'string' },
        { name: 'notes', type: 'string' },
        { name: 'created_at', type: 'number' },
      ]
    })
  ]
})