import { describe, it, expect } from "vitest";
import { EquipmentEntity } from "../../domain/equipment-entity";
import { CreateEquipmentInput } from "../../api/equipmentApi";

describe("EquipmentEntity - Form Validation", () => {
  describe("validateFormData", () => {
    const validFormData: CreateEquipmentInput = {
      name: "テストノートパソコン",
      category: "電子機器",
      status: "利用可能",
      quantity: 1,
      storageLocation: "オフィスA",
      purchaseDate: "2024-01-01"
    };

    it("有効なフォームデータで成功する", () => {
      const result = EquipmentEntity.validateFormData(validFormData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("必須フィールドが空の場合にエラーを返す", () => {
      const invalidData = {
        name: "",
        category: undefined,
        status: undefined,
        quantity: undefined,
        storageLocation: "",
        purchaseDate: undefined
      };

      const result = EquipmentEntity.validateFormData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("備品名は必須です");
      expect(result.errors).toContain("カテゴリを選択してください");
      expect(result.errors).toContain("ステータスを選択してください");
      expect(result.errors).toContain("数量は1以上である必要があります");
      expect(result.errors).toContain("保管場所は必須です");
      expect(result.errors).toContain("購入日は必須です");
    });

    it("ゼロ以下の数量でエラーを返す", () => {
      const dataWithZeroQuantity = {
        ...validFormData,
        quantity: 0
      };

      const result = EquipmentEntity.validateFormData(dataWithZeroQuantity);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("数量は1以上である必要があります");
    });
  });

  describe("validateBusinessRulesForForm", () => {
    it("貸出中ステータスで使用者が空の場合にエラーを返す", () => {
      const borrowedWithoutBorrower = {
        status: "貸出中" as const,
        borrower: ""
      };

      const errors = EquipmentEntity.validateBusinessRulesForForm(
        borrowedWithoutBorrower
      );

      expect(errors).toContain(
        "ステータスが「貸出中」の場合、使用者の入力は必須です"
      );
    });

    it("貸出中ステータスで使用者がある場合は成功する", () => {
      const borrowedWithBorrower = {
        status: "貸出中" as const,
        borrower: "山田太郎"
      };

      const errors =
        EquipmentEntity.validateBusinessRulesForForm(borrowedWithBorrower);

      expect(errors).toHaveLength(0);
    });

    it("利用可能ステータスで使用者がある場合に警告を返す", () => {
      const availableWithBorrower = {
        status: "利用可能" as const,
        borrower: "田中花子"
      };

      const errors = EquipmentEntity.validateBusinessRulesForForm(
        availableWithBorrower
      );

      expect(errors).toContain(
        "ステータスが「利用可能」の場合、使用者は通常設定しません"
      );
    });

    it("未来の購入日でエラーを返す", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const dataWithFutureDate = {
        purchaseDate: futureDate.toISOString().split("T")[0]
      };

      const errors =
        EquipmentEntity.validateBusinessRulesForForm(dataWithFutureDate);

      expect(errors).toContain("購入日は未来の日付にできません");
    });

    it("今日の購入日は成功する", () => {
      const today = new Date().toISOString().split("T")[0];

      const dataWithToday = {
        purchaseDate: today
      };

      const errors =
        EquipmentEntity.validateBusinessRulesForForm(dataWithToday);

      // 購入日関連のエラーがないことを確認
      const purchaseDateErrors = errors.filter((error) =>
        error.includes("購入日")
      );
      expect(purchaseDateErrors).toHaveLength(0);
    });

    it("備品名が長すぎる場合にエラーを返す", () => {
      const longName = "あ".repeat(101); // 101文字

      const dataWithLongName = {
        name: longName
      };

      const errors =
        EquipmentEntity.validateBusinessRulesForForm(dataWithLongName);

      expect(errors).toContain("備品名は100文字以内で入力してください");
    });

    it("数量が上限を超える場合にエラーを返す", () => {
      const dataWithHighQuantity = {
        quantity: 10000
      };

      const errors =
        EquipmentEntity.validateBusinessRulesForForm(dataWithHighQuantity);

      expect(errors).toContain("数量は9999以下で入力してください");
    });
  });

  describe("validateField", () => {
    it("名前フィールドの個別バリデーション", () => {
      // 空の名前
      const emptyNameErrors = EquipmentEntity.validateField("name", "");
      expect(emptyNameErrors).toContain("備品名は必須です");

      // 長すぎる名前
      const longNameErrors = EquipmentEntity.validateField(
        "name",
        "あ".repeat(101)
      );
      expect(longNameErrors).toContain("備品名は100文字以内で入力してください");

      // 有効な名前
      const validNameErrors = EquipmentEntity.validateField(
        "name",
        "有効な備品名"
      );
      expect(validNameErrors).toHaveLength(0);
    });

    it("数量フィールドの個別バリデーション", () => {
      // ゼロ
      const zeroErrors = EquipmentEntity.validateField("quantity", 0);
      expect(zeroErrors).toContain("数量は1以上である必要があります");

      // 上限超過
      const highErrors = EquipmentEntity.validateField("quantity", 10000);
      expect(highErrors).toContain("数量は9999以下で入力してください");

      // 有効な数量
      const validErrors = EquipmentEntity.validateField("quantity", 5);
      expect(validErrors).toHaveLength(0);
    });

    it("使用者フィールドの関連バリデーション", () => {
      // 貸出中で使用者なし
      const borrowedEmptyErrors = EquipmentEntity.validateField(
        "borrower",
        "",
        { status: "貸出中" }
      );
      expect(borrowedEmptyErrors).toContain(
        "ステータスが「貸出中」の場合、使用者の入力は必須です"
      );

      // 利用可能で使用者あり
      const availableWithBorrowerErrors = EquipmentEntity.validateField(
        "borrower",
        "山田太郎",
        { status: "利用可能" }
      );
      expect(availableWithBorrowerErrors).toContain(
        "ステータスが「利用可能」の場合、使用者は通常設定しません"
      );

      // 貸出中で使用者あり（正常）
      const validBorrowerErrors = EquipmentEntity.validateField(
        "borrower",
        "山田太郎",
        { status: "貸出中" }
      );
      expect(validBorrowerErrors).toHaveLength(0);
    });
  });

  describe("getFormDefaults", () => {
    it("適切なデフォルト値を返す", () => {
      const defaults = EquipmentEntity.getFormDefaults();

      expect(defaults.category).toBe("AV機器・周辺機器");
      expect(defaults.status).toBe("利用可能");
      expect(defaults.quantity).toBe(1);
      expect(defaults.borrower).toBe("");
      expect(defaults.notes).toBe("");

      // 今日の日付が設定されていることを確認
      const today = new Date().toISOString().split("T")[0];
      expect(defaults.purchaseDate).toBe(today);
    });
  });

  describe("prepareForSubmission", () => {
    it("フォームデータを送信用に整形する", () => {
      const formData: CreateEquipmentInput = {
        name: "  テスト備品  ",
        category: "電子機器",
        status: "利用可能",
        quantity: 1,
        storageLocation: "  オフィスA  ",
        purchaseDate: "2024-01-01",
        borrower: "  ",
        notes: "  "
      };

      const prepared = EquipmentEntity.prepareForSubmission(formData);

      // 文字列のトリムが適用されていることを確認
      expect(prepared.name).toBe("テスト備品");
      expect(prepared.storageLocation).toBe("オフィスA");

      // 空文字はundefinedに変換されることを確認
      expect(prepared.borrower).toBeUndefined();
      expect(prepared.notes).toBeUndefined();
    });

    it("有効な値はそのまま保持する", () => {
      const formData: CreateEquipmentInput = {
        name: "テスト備品",
        category: "電子機器",
        status: "貸出中",
        quantity: 2,
        storageLocation: "オフィスA",
        purchaseDate: "2024-01-01",
        borrower: "山田太郎",
        notes: "重要な備品です"
      };

      const prepared = EquipmentEntity.prepareForSubmission(formData);

      expect(prepared.borrower).toBe("山田太郎");
      expect(prepared.notes).toBe("重要な備品です");
      expect(prepared.quantity).toBe(2);
    });
  });
});
