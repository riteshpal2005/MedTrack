import { Model } from "@nozbe/watermelondb";
import { date, relation, text } from "@nozbe/watermelondb/decorators";

export default class HealthRecord extends Model {

  static table = 'health_records';

  @relation('profiles', 'profile_id') profile!: any;

  @text('type') type!: string;
  @text('notes') notes!: string;
  @date('created_at') createdAt!: Date;
}