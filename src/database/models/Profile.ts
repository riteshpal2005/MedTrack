import { Model } from '@nozbe/watermelondb';
import { field, date, children } from '@nozbe/watermelondb/decorators';

export default class Profile extends Model {

  static table = 'profiles';

  @field('name') name!: string;
  @date('created_at') createdAt!: Date;

  @children('medicines') medicines!: any;
  @children('history_logs') historyLogs!: any;
  @children('health_records') healthRecords!: any;
}