import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EquipmentCategory, EquipmentStatus } from "../types/equipment";

type FilterState = {
  // State
  categoryFilter: EquipmentCategory | "";
  statusFilter: EquipmentStatus | "";

  // Actions
  setCategoryFilter: (category: EquipmentCategory | "") => void;
  setStatusFilter: (status: EquipmentStatus | "") => void;
  setFiltersFromUrl: (
    category: EquipmentCategory | "",
    status: EquipmentStatus | ""
  ) => void;
  clearFilters: () => void;
};

// ストアを定義
const useFilterStore = create<FilterState>()(
  devtools(
    (set) => ({
      // Initial State
      categoryFilter: "",
      statusFilter: "",

      // Actions
      setCategoryFilter: (category) =>
        set({ categoryFilter: category }, false, "setCategoryFilter"),
      setStatusFilter: (status) =>
        set({ statusFilter: status }, false, "setStatusFilter"),
      setFiltersFromUrl: (category, status) =>
        set(
          { categoryFilter: category, statusFilter: status },
          false,
          "setFiltersFromUrl"
        ),
      clearFilters: () =>
        set({ categoryFilter: "", statusFilter: "" }, false, "clearFilters")
    }),
    { name: "Filter Store" }
  )
);

export default useFilterStore;
