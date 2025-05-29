import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "../../api/client";
import {
  fetchEquipment,
  createEquipment,
  ValidationError,
  isEquipment
} from "../../api/equipmentApi";

// APIクライアントをモック
vi.mock("../../api/client");

describe("Equipment API Runtime Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchEquipment", () => {
    it("正常なデータを受け入れる", async () => {
      const validData = [
        {
          id: "001",
          name: "テスト備品",
          category: "電子機器",
          status: "利用可能",
          quantity: 1,
          storageLocation: "倉庫A",
          purchaseDate: "2024-01-01",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        }
      ];

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: validData
      });

      const result = await fetchEquipment();
      expect(result).toEqual(validData);
    });

    it("不正なカテゴリでValidationErrorをスローする", async () => {
      const invalidData = [
        {
          id: "001",
          name: "テスト備品",
          category: "無効なカテゴリ", // Invalid!
          status: "利用可能",
          quantity: 1,
          storageLocation: "倉庫A",
          purchaseDate: "2024-01-01",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        }
      ];

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: invalidData
      });

      await expect(fetchEquipment()).rejects.toThrow(ValidationError);
    });

    it("必須フィールドが欠けている場合にエラーをスローする", async () => {
      const incompleteData = [
        {
          id: "001",
          name: "テスト備品",
          // category is missing! 👈
          status: "利用可能",
          quantity: 1,
          storageLocation: "倉庫A",
          purchaseDate: "2024-01-01",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        }
      ];

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: incompleteData
      });

      await expect(fetchEquipment()).rejects.toThrow(ValidationError);
    });

    it("型が間違っている場合にエラーをスローする", async () => {
      const wrongTypeData = [
        {
          id: "001",
          name: "テスト備品",
          category: "電子機器",
          status: "利用可能",
          quantity: "文字列", // 👈 Should be number!
          storageLocation: "倉庫A",
          purchaseDate: "2024-01-01",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        }
      ];

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: wrongTypeData
      });

      await expect(fetchEquipment()).rejects.toThrow(ValidationError);
    });
  });

  describe("createEquipment", () => {
    it("無効な入力データでエラーをスローする", async () => {
      const invalidInput = {
        name: "", // 👈 Empty string!
        category: "電子機器" as const,
        status: "利用可能" as const,
        quantity: -1, // 👈 Negative number!
        storageLocation: "倉庫A",
        purchaseDate: "2024/01/01" // 👈 Wrong format!
      };

      await expect(createEquipment(invalidInput)).rejects.toThrow(
        ValidationError
      );
    });

    it("APIレスポンスが無効な場合にエラーをスローする", async () => {
      const validInput = {
        name: "新規備品",
        category: "電子機器" as const,
        status: "利用可能" as const,
        quantity: 1,
        storageLocation: "倉庫A",
        purchaseDate: "2024-01-01"
      };

      // APIが無効なレスポンスを返す
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: {
          id: "001",
          name: "新規備品"
          // Missing required fields!
        }
      });

      await expect(createEquipment(validInput)).rejects.toThrow(
        ValidationError
      );
    });
  });

  describe("isEquipment type guard", () => {
    it("有効なデータに対してtrueを返す", () => {
      const validData = {
        id: "001",
        name: "テスト備品",
        category: "電子機器",
        status: "利用可能",
        quantity: 1,
        storageLocation: "倉庫A",
        purchaseDate: "2024-01-01",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      };

      expect(isEquipment(validData)).toBe(true);
    });

    it("無効なデータに対してfalseを返す", () => {
      const invalidData = {
        id: "001",
        name: "テスト備品",
        category: "無効なカテゴリ"
      };

      expect(isEquipment(invalidData)).toBe(false);
    });
  });
});
