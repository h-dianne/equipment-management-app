import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EquipmentCategory, EquipmentStatus } from "../types/equipment";

type FilterState = {
  // State
  categoryFilter: EquipmentCategory | "";
  statusFilter: EquipmentStatus | "";
  searchQuery: string;

  // Actions
  setCategoryFilter: (category: EquipmentCategory | "") => void;
  setStatusFilter: (status: EquipmentStatus | "") => void;
  setSearchQuery: (query: string) => void;
  setFiltersFromUrl: (
    category: EquipmentCategory | "",
    status: EquipmentStatus | "",
    search?: string
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
      searchQuery: "", //

      // Actions
      setCategoryFilter: (category) =>
        set({ categoryFilter: category }, false, "setCategoryFilter"),

      setStatusFilter: (status) =>
        set({ statusFilter: status }, false, "setStatusFilter"),

      setSearchQuery: (query) =>
        set({ searchQuery: query }, false, "setSearchQuery"),

      setFiltersFromUrl: (category, status, search = "") =>
        set(
          {
            categoryFilter: category,
            statusFilter: status,
            searchQuery: search
          },
          false,
          "setFiltersFromUrl"
        ),

      clearFilters: () =>
        set(
          {
            categoryFilter: "",
            statusFilter: "",
            searchQuery: ""
          },
          false,
          "clearFilters"
        )
    }),
    { name: "Filter Store" }
  )
);

export default useFilterStore;
