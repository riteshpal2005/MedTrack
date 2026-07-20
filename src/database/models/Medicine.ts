import { Model } from '@nozbe/watermelondb';
import { field, date, relation, children, text, json } from '@nozbe/watermelondb/decorators';

const sanitizeSchedule = (raw: any) => raw;

export default class Medicine extends Model { 
  static table = 'medicines';

  @relation('profiles', 'profile_id') profile!: any;
  
  @text('name') name!: string;
  @text('dosage') dosage!: string;
  @field('inventory_count') inventoryCount!: number;
  @field('warning_level') warningLevel!: number;
  @json('schedule', sanitizeSchedule) schedule!: any;
  @field('is_archived') isArchived!: boolean;
  @date('created_at') createdAt!: Date;
  
  @children('history_logs') historyLogs!: any;
 }