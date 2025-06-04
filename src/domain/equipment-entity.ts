import { Equipment as EquipmentData } from "../types/equipment";
import { CreateEquipmentInput } from "../api/equipmentApi";

/**
 * 備品エンティティ - ビジネスロジックを含む
 *
 * 既存のEquipment型をベースに、ビジネスメソッドを追加
 */

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export class EquipmentEntity {
  constructor(private data: EquipmentData) {}

  // ファクトリーメソッド - 既存データから作成
  static fromData(data: EquipmentData): EquipmentEntity {
    return new EquipmentEntity(data);
  }

  // ビジネスメソッド: 削除可能性判定
  canBeDeleted(): boolean {
    // ビジネスルール: 貸出中は削除不可
    return this.data.status !== "貸出中";
  }

  // ビジネスメソッド: 編集可能性判定
  canBeEdited(): boolean {
    // ビジネスルール: 廃棄済みは編集不可
    return this.data.status !== "廃棄";
  }

  // ビジネスメソッド: 貸出可能性判定
  canBeBorrowed(): boolean {
    // ビジネスルール: 利用可能で在庫ありの場合のみ貸出可能
    return this.data.status === "利用可能" && this.data.quantity > 0;
  }

  // ビジネスメソッド: 返却可能性判定
  canBeReturned(): boolean {
    // ビジネスルール: 貸出中の場合のみ返却可能
    return this.data.status === "貸出中";
  }

  // ビジネスメソッド: データ整合性チェック
  hasConsistentData(): boolean {
    const hasBorrower = !!(
      this.data.borrower && this.data.borrower.trim().length > 0
    );

    // ルール1: 貸出中の場合は使用者が必須
    if (this.data.status === "貸出中") {
      return hasBorrower; // 使用者がいる場合のみOK
    }

    // ルール2: 使用中の場合は使用者がいてもいなくてもOK
    if (this.data.status === "使用中") {
      return true; // 常にOK
    }

    // ルール3: その他のステータス（利用可能、廃棄など）では使用者がいない方が正常
    // ただし、使用者がいても警告レベル（エラーではない）
    return true;
  }

  // データアクセス
  get id(): string {
    return this.data.id;
  }
  get name(): string {
    return this.data.name;
  }
  get status(): string {
    return this.data.status;
  }
  get borrower(): string | undefined {
    return this.data.borrower;
  }
  get quantity(): number {
    return this.data.quantity;
  }

  // 生データを取得（API送信用）
  toData(): EquipmentData {
    return { ...this.data };
  }

  // === フォーム専用のバリデーションメソッド ===

  /**
   * フォーム入力データの完全なバリデーション
   * @param formData フォームから送信されたデータ
   * @returns バリデーション結果
   */
  static validateFormData(
    formData: Partial<CreateEquipmentInput>
  ): ValidationResult {
    const errors: string[] = [];

    // 必須フィールドのチェック
    if (!formData.name || formData.name.trim().length === 0) {
      errors.push("備品名は必須です");
    }

    if (!formData.category) {
      errors.push("カテゴリを選択してください");
    }

    if (!formData.status) {
      errors.push("ステータスを選択してください");
    }

    if (!formData.quantity || formData.quantity < 1) {
      errors.push("数量は1以上である必要があります");
    }

    if (
      !formData.storageLocation ||
      formData.storageLocation.trim().length === 0
    ) {
      errors.push("保管場所は必須です");
    }

    if (!formData.purchaseDate) {
      errors.push("購入日は必須です");
    }

    // ビジネスルールのチェック
    const businessRuleErrors = this.validateBusinessRulesForForm(formData);
    errors.push(...businessRuleErrors);

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * フォーム用のビジネスルール検証
   * @param formData フォームデータ
   * @returns ビジネスルール違反のエラー配列
   */
  static validateBusinessRulesForForm(
    formData: Partial<CreateEquipmentInput>
  ): string[] {
    const errors: string[] = [];

    // ビジネスルール: 貸出中の場合は使用者が必須
    if (formData.status === "貸出中") {
      if (!formData.borrower || formData.borrower.trim().length === 0) {
        errors.push("ステータスが「貸出中」の場合、使用者の入力は必須です");
      }
    }

    // ビジネスルール: 利用可能/廃棄の場合は使用者を設定すべきでない（警告レベル）
    if (
      (formData.status === "利用可能" || formData.status === "廃棄") &&
      formData.borrower &&
      formData.borrower.trim().length > 0
    ) {
      errors.push(
        `ステータスが「${formData.status}」の場合、使用者は通常設定しません`
      );
    }

    // ビジネスルール: 購入日は未来日不可
    if (formData.purchaseDate) {
      const today = new Date().toISOString().split("T")[0]; // "2025-06-04"

      if (formData.purchaseDate > today) {
        errors.push("購入日は未来の日付にできません");
      }
    }

    // ビジネスルール: 備品名の長さ制限
    if (formData.name && formData.name.length > 100) {
      errors.push("備品名は100文字以内で入力してください");
    }

    // ビジネスルール: 数量の上限チェック
    if (formData.quantity && formData.quantity > 9999) {
      errors.push("数量は9999以下で入力してください");
    }

    return errors;
  }

  /**
   * フィールド別のバリデーション（リアルタイム用）
   * @param fieldName フィールド名
   * @param value フィールドの値
   * @param otherValues 他のフィールドの値（関連チェック用）
   * @returns そのフィールドのエラー配列
   */
  static validateField(
    fieldName: keyof CreateEquipmentInput,
    value: string | number | undefined,
    otherValues: Partial<CreateEquipmentInput> = {}
  ): string[] {
    const errors: string[] = [];

    switch (fieldName) {
      case "name":
        if (
          !value ||
          (typeof value === "string" && value.trim().length === 0)
        ) {
          errors.push("備品名は必須です");
        } else if (typeof value === "string" && value.length > 100) {
          errors.push("備品名は100文字以内で入力してください");
        }
        break;

      case "quantity":
        if (!value || (typeof value === "number" && value < 1)) {
          errors.push("数量は1以上である必要があります");
        } else if (typeof value === "number" && value > 9999) {
          errors.push("数量は9999以下で入力してください");
        }
        break;

      case "purchaseDate":
        if (!value) {
          errors.push("購入日は必須です");
        } else if (typeof value === "string") {
          const purchaseDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (purchaseDate > today) {
            errors.push("購入日は未来の日付にできません");
          }
        }
        break;

      case "borrower": {
        const borrowerValue = typeof value === "string" ? value : "";
        // 使用者フィールドのビジネスルールチェック
        if (
          otherValues.status === "貸出中" &&
          (!borrowerValue || borrowerValue.trim().length === 0)
        ) {
          errors.push("ステータスが「貸出中」の場合、使用者の入力は必須です");
        }
        if (
          (otherValues.status === "利用可能" ||
            otherValues.status === "廃棄") &&
          borrowerValue &&
          borrowerValue.trim().length > 0
        ) {
          errors.push(
            `ステータスが「${otherValues.status}」の場合、使用者は通常設定しません`
          );
        }
        break;
      }

      case "storageLocation":
        if (
          !value ||
          (typeof value === "string" && value.trim().length === 0)
        ) {
          errors.push("保管場所は必須です");
        }
        break;

      case "category":
        if (!value) {
          errors.push("カテゴリを選択してください");
        }
        break;

      case "status":
        if (!value) {
          errors.push("ステータスを選択してください");
        }
        break;
    }

    return errors;
  }

  /**
   * フォームの推奨デフォルト値を生成
   * @returns 新規備品作成時の推奨デフォルト値
   */
  static getFormDefaults(): Partial<CreateEquipmentInput> {
    return {
      category: "AV機器・周辺機器",
      status: "利用可能",
      quantity: 1,
      purchaseDate: new Date().toISOString().split("T")[0], // 今日の日付
      borrower: "",
      notes: ""
    };
  }

  /**
   * フォームデータをAPI送信用に変換
   * @param formData フォームデータ
   * @returns API送信可能な形式
   */
  static prepareForSubmission(
    formData: CreateEquipmentInput
  ): CreateEquipmentInput {
    return {
      ...formData,
      name: formData.name.trim(),
      storageLocation: formData.storageLocation.trim(),
      borrower: formData.borrower?.trim() || undefined,
      notes: formData.notes?.trim() || undefined
    };
  }
}
