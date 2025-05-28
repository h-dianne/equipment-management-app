import { z } from "zod";
import { apiClient } from "./client";

export const EquipmentSchema = z.object({
  id: z.string(), // 管理番号
  name: z.string(), // 備品名
  category: z.enum([
    "電子機器",
    "オフィス家具",
    "工具・作業用品",
    "AV機器・周辺機器",
    "消耗品",
    "防災・安全用品",
    "レンタル備品",
    "社用車関連品"
  ] as const), // カテゴリ
  status: z.enum(["使用中", "貸出中", "利用可能", "廃棄"] as const), // ステータス
  quantity: z.number(), // 在庫数
  storageLocation: z.string(), // 保管場所
  purchaseDate: z.string(), // 購入日 (YYYY-MM-DD形式)
  borrower: z.string().optional(), // 使用者 (貸出中の場合)
  createdAt: z.string(), // 登録日時
  updatedAt: z.string(), // 更新日時
  notes: z.string().optional() // 備考
});

export const EquipmentsSchema = z.array(EquipmentSchema);

// スキーマから型を導出
export type Equipment = z.infer<typeof EquipmentSchema>;
export type Equipments = z.infer<typeof EquipmentsSchema>;
export type EquipmentCategory = Equipment["category"];
export type EquipmentStatus = Equipment["status"];

// 備品情報を取得する関数
export const fetchEquipment = async (): Promise<Equipment[]> => {
  const { data } = await apiClient.get<Equipment[]>("/equipments");
  return EquipmentsSchema.parse(data);
};

// IDを指定して備品情報を取得する関数
export const fetchEquipmentById = async (id: string): Promise<Equipment> => {
  const { data } = await apiClient.get<Equipment>(`/equipments/${id}`);
  return EquipmentSchema.parse(data);
};

// 新規備品情報を登録する関数
export const createEquipment = async (
  equipment: Omit<Equipment, "id" | "createdAt" | "updatedAt">
): Promise<Equipment> => {
  const now = new Date().toISOString();
  const newEquipment = {
    ...equipment,
    createdAt: now,
    updatedAt: now
  };

  const { data } = await apiClient.post<Equipment>("/equipments", newEquipment);
  return EquipmentSchema.parse(data);
};

// 備品情報を更新する関数
export const updateEquipment = async (
  id: string,
  equipment: Partial<Omit<Equipment, "id" | "createdAt" | "updatedAt">>
): Promise<Equipment> => {
  const updateData = {
    ...equipment,
    updatedAt: new Date().toISOString()
  };

  const { data } = await apiClient.patch<Equipment>(
    `/equipments/${id}`,
    updateData
  );
  return EquipmentSchema.parse(data);
};

// 備品情報を削除する関数
export const deleteEquipment = async (id: string): Promise<void> => {
  await apiClient.delete(`/equipments/${id}`);
};
