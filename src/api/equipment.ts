// src\api\equipment.ts

import axios from "axios";
import { z } from "zod";
import toast from "react-hot-toast";

export const EquipmentSchema = z.object({
  id: z.string(), // 管理番号
  name: z.string(), // 備品名
  category: z.string(), // カテゴリ (例: 事務用品、OA機器、家具など)
  status: z.enum(["使用中", "貸出中", "利用可能", "廃棄"]), // ステータス
  quantity: z.number(), // 在庫数
  storageLocation: z.string(), // 保管場所
  purchaseDate: z.string(), // 購入日 (YYYY-MM-DD形式)
  borrower: z.string().optional(), // 使用者 (貸出中の場合)
  createdAt: z.string(), // 登録日時
  updatedAt: z.string(), // 更新日時
  notes: z.string().optional() // 備考
});

export const EquipmentsSchema = z.array(EquipmentSchema);
export type Equipment = z.infer<typeof EquipmentSchema>;
export type Equipments = z.infer<typeof EquipmentsSchema>;

// API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// 備品情報を取得する関数
/* export const fetchEquipment = async (): Promise<Equipment[]> => {
  try {
    const response = await axios.get<unknown>(`${API_BASE_URL}/api/equipments`);
    return EquipmentsSchema.parse(response.data);
  } catch (error) {
    console.error("Error fetching equipment data:", error);
    throw new Error("Failed to fetch equipment data");
  }
}; */

// 備品情報を取得する関数
export const fetchEquipment = async (): Promise<Equipment[]> => {
  try {
    // ダミーデータ
    const dummyData = [
      {
        id: "E001",
        name: "MacBookノートパソコン",
        category: "OA機器",
        status: "使用中" as const,
        quantity: 2,
        storageLocation: "個人デスク",
        purchaseDate: "2022-01-15",
        borrower: "",
        createdAt: "2022-01-15",
        updatedAt: "2022-02-15",
        notes: "AさんとBさんが使用中"
      },
      {
        id: "E002",
        name: "Sonyカメラ",
        category: "OA機器",
        status: "貸出中" as const,
        quantity: 1,
        storageLocation: "ロッカー①",
        purchaseDate: "2022-01-15",
        borrower: "Cさん",
        createdAt: "2022-01-15",
        updatedAt: "2022-02-15",
        notes: "Cさんが使用中"
      }
    ];

    return EquipmentsSchema.parse(dummyData);
  } catch (error) {
    toast.error("備品データの取得に失敗しました");
    throw error;
  }
};

// IDを指定して備品情報を取得する関数
export const fetchEquipmentById = async (id: string): Promise<Equipment> => {
  try {
    const response = await axios.get<unknown>(
      `${API_BASE_URL}/api/equipments/${id}`
    );
    return EquipmentSchema.parse(response.data);
  } catch (error) {
    toast.error(`ID: ${id} の備品データ取得に失敗しました`);
    throw error;
  }
};

// 新規備品情報を登録する関数
export const createEquipment = async (
  equipment: Omit<Equipment, "id" | "createdAt" | "updatedAt">
): Promise<Equipment> => {
  try {
    const response = await axios.post<unknown>(
      `${API_BASE_URL}/api/equipments`,
      equipment
    );
    toast.success("備品を登録しました");
    return EquipmentSchema.parse(response.data);
  } catch (error) {
    toast.error("備品の登録に失敗しました");
    throw error;
  }
};

// 備品情報を更新する関数
export const updateEquipment = async (
  id: string,
  equipment: Partial<Omit<Equipment, "id" | "createdAt" | "updatedAt">>
): Promise<Equipment> => {
  try {
    const response = await axios.put<unknown>(
      `${API_BASE_URL}/api/equipments/${id}`,
      equipment
    );
    toast.success("備品情報を更新しました");
    return EquipmentSchema.parse(response.data);
  } catch (error) {
    toast.error(`ID: ${id} の備品情報の更新に失敗しました`);
    throw error;
  }
};

// 備品情報を削除する関数
export const deleteEquipment = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/api/equipments/${id}`);
    toast.success("備品を削除しました");
  } catch (error) {
    toast.error(`ID: ${id} の備品削除に失敗しました`);
    throw error;
  }
};
