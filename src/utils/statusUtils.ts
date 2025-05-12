import { EquipmentStatus } from "../types/equipment";

/**
 * Returns the appropriate Tailwind CSS classes for a given equipment status
 * @param status - The equipment status
 * @returns Tailwind CSS classes for background and text color
 */
export const getStatusColor = (status: EquipmentStatus): string => {
  const statusColors: Record<EquipmentStatus, string> = {
    使用中: "bg-blue-100 text-blue-800",
    貸出中: "bg-yellow-100 text-yellow-800",
    利用可能: "bg-green-100 text-green-800",
    廃棄: "bg-gray-100 text-gray-800"
  };

  return statusColors[status] || "bg-gray-100 text-gray-800";
};
