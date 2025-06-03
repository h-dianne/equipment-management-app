import { Equipment as EquipmentData } from "../types/equipment";

/**
 * 備品エンティティ - ビジネスロジックを含む
 *
 * 既存のEquipment型をベースに、ビジネスメソッドを追加
 */

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
    // ビジネスルール: 使用者がいる場合はステータスが貸出中であること
    const hasBorrower =
      this.data.borrower && this.data.borrower.trim().length > 0;

    if (hasBorrower) {
      return this.data.status === "貸出中";
    }

    // 使用者がいない場合は貸出中以外であること
    return this.data.status !== "貸出中";
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
}
