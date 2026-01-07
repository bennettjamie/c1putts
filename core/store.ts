import { create } from 'zustand';
import { PuttResult } from './scoring';

interface SessionState {
    currentSessionPutts: PuttResult[];
    addPutt: (putt: PuttResult) => void;
    clearSession: () => void;
    undoPutt: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    currentSessionPutts: [],
    addPutt: (putt) => set((state) => ({ currentSessionPutts: [...state.currentSessionPutts, putt] })),
    clearSession: () => set({ currentSessionPutts: [] }),
    undoPutt: () => set((state) => ({ currentSessionPutts: state.currentSessionPutts.slice(0, -1) })),
}));
