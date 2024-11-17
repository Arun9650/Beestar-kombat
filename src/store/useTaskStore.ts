// store.ts
import create from 'zustand';

interface TaskStore {
  isNewTaskAdded: boolean;
  setIsNewTaskAdded: (value: boolean) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  isNewTaskAdded: false,
  setIsNewTaskAdded: (value) => set({ isNewTaskAdded: value }),
}));