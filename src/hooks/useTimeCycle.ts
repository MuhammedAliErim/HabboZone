import { create } from 'zustand';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

interface TimeCycleState {
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;
  initTimeCycle: () => void;
}

export const useTimeCycle = create<TimeCycleState>((set) => ({
  timeOfDay: 'morning', // default
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  initTimeCycle: () => {
    // Determine time based on current hour
    const hour = new Date().getHours();
    let initialTime: TimeOfDay = 'morning';

    if (hour >= 6 && hour < 12) {
      initialTime = 'morning';
    } else if (hour >= 12 && hour < 18) {
      initialTime = 'afternoon';
    } else if (hour >= 18 && hour < 22) {
      initialTime = 'evening';
    } else {
      initialTime = 'night';
    }

    set({ timeOfDay: initialTime });

    // Note: We can also set up an interval here if we want it to automatically update while user is on site
  },
}));
