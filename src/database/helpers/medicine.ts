import { database } from "..";
import Medicine from "../models/Medicine";
import Profile from "../models/Profile";
import { NotificationService } from "../../services/NotificationService";

export interface AddMedicineParams {
  profileId: string;
  name: string;
  dosage: string;
  inventoryCount: number;
  warningLevel: number;
  schedule: any;
}

export const addMedicine = async (params: AddMedicineParams): Promise<Medicine> => {
  return await database.write(async () => {
    const medicineCollection = database.collections.get<Medicine>('medicines');
    const profileCollection = database.collections.get<Profile>('profiles');
    const profile = await profileCollection.find(params.profileId);
    const newMed = await medicineCollection.create((medicine) => {
      medicine.profile.set(profile);
      medicine.name = params.name;
      medicine.dosage = params.dosage;
      medicine.inventoryCount = params.inventoryCount;
      medicine.warningLevel = params.warningLevel;
      medicine.schedule = params.schedule;
      medicine.isArchived = false;
      medicine.createdAt = new Date();
    });

    if (params.schedule && params.schedule.time) {
      try {
        await NotificationService.createChannel();
        await NotificationService.scheduleMedicineReminder(newMed.id, newMed.name, params.schedule.time);
      } catch (error) {
        console.warn('Failed to schedule notification:', error);
      }
    }

    return newMed;
  });
};

export const updateInventory = async (medicineId: string, amountToSubtract: number): Promise<void> => {
  return await database.write(async () => {
    const medicineCollection = database.collections.get<Medicine>('medicines');
    const medicine = await medicineCollection.find(medicineId);

    await medicine.update((m) => {
      m.inventoryCount = Math.max(0, m.inventoryCount - amountToSubtract);
    });
  });
};

export const archiveMedicine = async (medicineId: string): Promise<void> => {
  return await database.write(async () => {
    const medicineCollection = database.collections.get<Medicine>('medicines');
    const medicine = await medicineCollection.find(medicineId);

    await medicine.update((m) => {
      m.isArchived = true;
    });
  });
};

export const deleteMedicine = async (medicineId: string): Promise<void> => {
  return await database.write(async () => {
    const medicineCollection = database.collections.get<Medicine>('medicines');
    const medicine = await medicineCollection.find(medicineId);
    
    // Cascading delete history logs
    const historyLogs = await medicine.historyLogs.fetch();
    for (const log of historyLogs) {
      await log.markAsDeleted();
    }
    
    try {
      await NotificationService.cancelMedicineReminder(medicineId);
    } catch (error) {
      console.warn('Failed to cancel notification:', error);
    }
    await medicine.markAsDeleted();
  })
}