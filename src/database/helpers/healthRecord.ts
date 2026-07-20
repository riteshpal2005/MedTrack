import { database } from "..";
import HealthRecord from "../models/HealthRecord";
import Profile from "../models/Profile";

export const addHealthRecords = async (profileId: string, type: string, notes: string): Promise<HealthRecord> => {
  return await database.write(async () => {
    const healthRecordCollection = database.collections.get<HealthRecord>('health_records');
    const profileCollection = database.collections.get<Profile>('profiles');

    const profile = await profileCollection.find(profileId);

    return await healthRecordCollection.create((record) => {
      record.profile.set(profile);
      record.type = type;
      record.notes = notes;
      record.createdAt = new Date();
    });
  });
};