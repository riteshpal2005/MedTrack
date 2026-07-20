import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv'

const storage = createMMKV({
  id: 'profile-storage'
});

const zustandStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
}

export interface Profile {
  id: string;
  name: string;
  createdAt: number;
}

interface ProfileState {
  profiles: Profile[];
  activeProfileId: string | null;
  addProfile: (name: string) => void;
  setActiveProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profiles: [],
      activeProfileId: null,
      addProfile: (name) => set((state) => {
        const newProfile: Profile = {
          id: Date.now().toString(),
          name,
          createdAt: Date.now(),
        };
        return {
          profiles: [...state.profiles, newProfile],
          activeProfileId: state.profiles.length === 0 ? newProfile.id: state.activeProfileId
        };
      }),

      setActiveProfile: (id) => set({ activeProfileId: id }),
      deleteProfile: (id) => set((state) => {
        const updatedProfiles = state.profiles.filter(p => p.id !== id);
        const newActiveId = state.activeProfileId === id ? (updatedProfiles[0]?.id ?? null) : state.activeProfileId;
        return {
          profiles: updatedProfiles,
          activeProfileId: newActiveId
        };
      }),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => zustandStorage)
    }
  )
);
