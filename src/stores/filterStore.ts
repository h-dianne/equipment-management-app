import { create } from "zustand";
import { EquipmentCategory, EquipmentStatus } from "../types/equipment";

interface FilterState {
  // State
  categoryFilter: EquipmentCategory | "";
  statusFilter: EquipmentStatus | "";

  // Actions
  setCategoryFilter: (category: EquipmentCategory | "") => void;
  setStatusFilter: (status: EquipmentStatus | "") => void;
  clearFilters: () => void;
}

// ストアを定義
const useFilterStore = create<FilterState>((set) => ({
  // Initial State
  categoryFilter: "",
  statusFilter: "",

  // Actions
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  clearFilters: () => set({ categoryFilter: "", statusFilter: "" })
}));

export default useFilterStore;
