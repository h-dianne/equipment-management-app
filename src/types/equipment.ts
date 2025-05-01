export type EquipmentStatus = "使用中" | "貸出中" | "利用可能" | "廃棄";

export type EquipmentCategory =
  | "電子機器"
  | "オフィス家具"
  | "工具・作業用品"
  | "AV機器・周辺機器"
  | "消耗品"
  | "防災・安全用品"
  | "レンタル備品"
  | "社用車関連品";

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  quantity: number;
  storageLocation: string;
  borrower?: string;
  createdAt: string;
  updatedAt?: string;
}
