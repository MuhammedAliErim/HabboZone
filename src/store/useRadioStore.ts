import { create } from 'zustand';

interface RadioState {
  isPlaying: boolean;
  volume: number;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
}

export const useRadioStore = create<RadioState>((set) => ({
  isPlaying: false,
  volume: 0.5,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
}));
