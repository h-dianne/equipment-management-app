import { z } from "zod";
import { apiClient } from "./client";

// Zodスキーマ定義
export const EquipmentSchema = z.object({
  id: z.string(), // 管理番号
  name: z.string().min(1, "備品名は必須です"), // 備品名
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
  quantity: z.number().min(0, "在庫数は0以上である必要があります"), // 在庫数
  storageLocation: z.string().min(1, "保管場所は必須です"), // 保管場所
  purchaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "日付はYYYY-MM-DD形式である必要があります"), // 購入日
  borrower: z.string().optional(), // 使用者 (貸出中の場合)
  createdAt: z.string(), // 登録日時
  updatedAt: z.string(), // 更新日時
  notes: z.string().optional() // 備考
});

export const EquipmentsSchema = z.array(EquipmentSchema);

// 作成用のスキーマ（id, createdAt, updatedAtを除外）
export const CreateEquipmentSchema = EquipmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// 更新用のスキーマ（すべてのフィールドをオプショナルに）
export const UpdateEquipmentSchema = EquipmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).partial();

// スキーマから型を導出
export type Equipment = z.infer<typeof EquipmentSchema>;
export type Equipments = z.infer<typeof EquipmentsSchema>;
export type CreateEquipmentInput = z.infer<typeof CreateEquipmentSchema>;
export type UpdateEquipmentInput = z.infer<typeof UpdateEquipmentSchema>;
export type EquipmentCategory = Equipment["category"];
export type EquipmentStatus = Equipment["status"];

// カスタムエラークラス
export class ValidationError extends Error {
  constructor(public errors: z.ZodError) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}

// バリデーションエラーハンドリング
const handleValidationError = (error: unknown): never => {
  if (error instanceof z.ZodError) {
    console.error("Validation errors:", error.errors);
    throw new ValidationError(error);
  }
  throw error;
};

// 備品情報を取得する関数
export const fetchEquipment = async (): Promise<Equipment[]> => {
  const { data } = await apiClient.get("/equipments");
  // 実行時バリデーション - APIレスポンスが期待する型と一致するか検証
  try {
    return EquipmentsSchema.parse(data);
  } catch (error) {
    return handleValidationError(error);
  }
};

// IDを指定して備品情報を取得する関数
export const fetchEquipmentById = async (id: string): Promise<Equipment> => {
  const { data } = await apiClient.get(`/equipments/${id}`);
  // 実行時バリデーション
  try {
    return EquipmentSchema.parse(data);
  } catch (error) {
    return handleValidationError(error);
  }
};

// 新規備品情報を登録する関数
export const createEquipment = async (
  equipment: CreateEquipmentInput
): Promise<Equipment> => {
  // 入力データのバリデーション
  let validatedInput: CreateEquipmentInput;
  try {
    validatedInput = CreateEquipmentSchema.parse(equipment);
  } catch (error) {
    return handleValidationError(error);
  }

  const now = new Date().toISOString();
  const newEquipment = {
    ...validatedInput,
    createdAt: now,
    updatedAt: now
  };

  const { data } = await apiClient.post("/equipments", newEquipment);

  // レスポンスのバリデーション
  try {
    return EquipmentSchema.parse(data);
  } catch (error) {
    return handleValidationError(error);
  }
};

// 備品情報を更新する関数
export const updateEquipment = async (
  id: string,
  equipment: UpdateEquipmentInput
): Promise<Equipment> => {
  // 入力データのバリデーション
  let validatedInput: UpdateEquipmentInput;
  try {
    validatedInput = UpdateEquipmentSchema.parse(equipment);
  } catch (error) {
    return handleValidationError(error);
  }

  const updateData = {
    ...validatedInput,
    updatedAt: new Date().toISOString()
  };

  const { data } = await apiClient.patch(`/equipments/${id}`, updateData);

  // レスポンスのバリデーション
  try {
    return EquipmentSchema.parse(data);
  } catch (error) {
    return handleValidationError(error);
  }
};

// 備品情報を削除する関数
export const deleteEquipment = async (id: string): Promise<void> => {
  if (!id || typeof id !== "string") {
    throw new Error("有効なIDが必要です");
  }

  await apiClient.delete(`/equipments/${id}`);
};

// ユーティリティ関数：安全な型チェック
export const isEquipment = (data: unknown): data is Equipment => {
  try {
    EquipmentSchema.parse(data);
    return true;
  } catch {
    return false;
  }
};

// ユーティリティ関数：部分的なデータの検証
export const validatePartialEquipment = (
  data: unknown
): UpdateEquipmentInput => {
  return UpdateEquipmentSchema.parse(data);
};
