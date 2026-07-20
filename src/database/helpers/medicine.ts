import { database } from "..";
import Medicine from "../models/Medicine";
import Profile from "../models/Profile";

export interface AddMedicinieParams {
  profileId: string;
  name: string;
  dosage: string;
  inventoryCount: number;
  warningLevel: number;
  schedule: any;
}

export const addMedicine = async (params: AddMedicinieParams): Promise<Medicine> => {
  return await database.write(async () => {
    const medicineCollection = database.collections.get<Medicine>('medicines');
    const profileCollection = database.collections.get<Profile>('profiles');
    const profile = await profileCollection.find(params.profileId);
    return await medicineCollection.create((medicine) => {
      medicine.profile.set(profile);
      medicine.name = params.name;
      medicine.dosage = params.dosage;
      medicine.inventoryCount = params.inventoryCount;
      medicine.warningLevel = params.warningLevel;
      medicine.schedule = params.schedule;
      medicine.isArchived = false;
      medicine.createdAt = new Date();
    });
  });
};

export const updateInvetory = async (medicineId: string, amountToSubtract: number): Promise<void> => {
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