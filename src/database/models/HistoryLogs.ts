import { Model } from '@nozbe/watermelondb';
import { date, relation, text } from '@nozbe/watermelondb/decorators';

export default class HistoryLog extends Model {
  static table = 'history_logs';

  @relation('medicines', 'medicine_id') medicine!: any;
  @relation('profiles', 'profile_id') profile!: any;
  
  @date('timestamp') timestamp!: Date;
  @text('scheduled_time') scheduledTime!: string;
  @text('status') status!: string;
}