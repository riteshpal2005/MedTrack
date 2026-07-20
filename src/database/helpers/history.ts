import { database } from "..";
import HistoryLog from "../models/HistoryLogs";
import Medicine from "../models/Medicine";
import Profile from "../models/Profile";

export const logMedicineAction = async (
  medicineId: string,
  profileId: string,
  scheduleTime: string,
  status: 'taken' | 'skipped' | 'missed'
): Promise<HistoryLog> => {
  return await database.write(async () => {
    const historyCollection = database.collections.get<HistoryLog>('history_logs');
    const medicineCollection = database.collections.get<Medicine>('medicines');
    const profileCollection = database.collections.get<Profile>('profiels');

    const medicine = await medicineCollection.find(medicineId);
    const profile = await profileCollection.find(profileId);

    return await historyCollection.create((log) => {
      log.medicine.set(medicine);
      log.profile.set(profile);
      log.timestamp = new Date();
      log.scheduledTime = scheduleTime;
      log.status = status;
    });
  });
};