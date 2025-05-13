import { create } from "zustand";
import { Equipment } from "../types/equipment";

interface EquipmentState {
  // State
  selectedEquipment: Equipment | null;
  recentlyViewed: string[];

  // Actions
  selectEquipment: (equipment: Equipment | null) => void;
  addToRecentlyViewed: (equipmentId: string) => void;
  clearRecentlyViewed: () => void;
}

// ストアを定義
const useEquipmentStore = create<EquipmentState>((set) => ({
  // Initial State
  selectedEquipment: null,
  recentlyViewed: [],

  // Actions
  selectEquipment: (equipment) => set({ selectedEquipment: equipment }),

  addToRecentlyViewed: (equipmentId) =>
    set((state) => {
      // Remove duplicates and add to beginning
      const newRecentlyViewed = [
        equipmentId,
        ...state.recentlyViewed.filter((id) => id !== equipmentId)
      ].slice(0, 5);

      return { recentlyViewed: newRecentlyViewed };
    }),

  clearRecentlyViewed: () => set({ recentlyViewed: [] })
}));

export default useEquipmentStore;
