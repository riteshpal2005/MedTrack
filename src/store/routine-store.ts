import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { scheduleSkincareReminders } from '../services/notification-service';

const storage = createMMKV({
  id: 'routine-storage'
});

const zustandStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.remove(name);
  },
};

export type TaskType = 'medication' | 'skincare' | 'hydration';

export interface RoutineTask {
  id: string;
  title: string;
  time: string; // e.g., "08:00 AM"
  type: TaskType;
  completed?: boolean;
}

interface RoutineState {
  tasks: RoutineTask[];
  addTask: (task: Omit<RoutineTask, 'id' | 'completed'>) => void;
  updateTask: (id: string, updatedTask: Partial<RoutineTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (task) => {
        const newTask: RoutineTask = {
          ...task,
          id: Date.now().toString(),
          completed: false,
        };
        set((state) => {
          const newTasks = [...state.tasks, newTask];
          // Sync notifications immediately when tasks change
          scheduleSkincareReminders(newTasks);
          return { tasks: newTasks };
        });
      },
      updateTask: (id, updatedTask) => {
        set((state) => {
          const newTasks = state.tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t));
          scheduleSkincareReminders(newTasks);
          return { tasks: newTasks };
        });
      },
      deleteTask: (id) => {
        set((state) => {
          const newTasks = state.tasks.filter((t) => t.id !== id);
          scheduleSkincareReminders(newTasks);
          return { tasks: newTasks };
        });
      },
      toggleTaskCompletion: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        }));
      },
    }),
    {
      name: 'routine-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
