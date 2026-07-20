import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'medicine-storage' });

const zustandStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
};

export type ScheduleType = 'daily' | 'interval' | 'specific_days' | 'as_needed';

export interface MedicineSchedule {
  type: ScheduleType;
  times: string[];
  startDate: number;
  intervalDays?: number;
  specificdays?: number[];
}

export interface Medicine {
  id: string;
  profileId: string;
  name: string;
  dosage: string;
  inventoryCount: number;
  warningLevel: number;
  schedule: MedicineSchedule;
  isArchived: boolean;
  createdAt: number;
}

interface MedicineState {
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, 'id' | 'cretedAt' | 'isArchived'>) => void;
  updateInventory: (id: string, amountToSubtract: number) => void;
  archiveMedicine: (id: string) => void;
  deleteMedicine: (id: string) => void;
}

export const useMedicineStore = create<MedicineState>()(
  persist(
    (set) => ({
      medicines: [],
      addMedicine: (medData) => set((state) => {
        const newMed: Medicine = {
          ...medData,
          id: Date.now().toString(),
          isArchived: false,
          createdAt: Date.now(),
        };
        return { medicines: [...state.medicines, newMed] };
      }),

      updateInventory: (id, amount) => set((state) => ({
        medicines: state.medicines.map(med => med.id === id ? { ...med, inventoryCount: Math.max(0, med.inventoryCount - amount) } : med )
      })),

      archiveMedicine: (id) => set((state) => ({
        medicines: state.medicines.map(med => med.id === id ? { ...med, isArchived: true } : med )
      })),

      deleteMedicine: (id) => set((state) => ({
        medicines: state.medicines.filter(med => med.id !== id)
      })),
    }),
    {
      name: 'medicine-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);