import { describe, it, expect } from "vitest";

import { EquipmentEntity } from "../equipment-entity";
import { Equipment } from "../../types/equipment";

describe("EquipmentEntity", () => {
  const createTestEquipment = (
    overrides: Partial<Equipment> = {}
  ): Equipment => ({
    id: "001",
    name: "テスト備品",
    category: "電子機器",
    status: "利用可能",
    quantity: 1,
    storageLocation: "倉庫A",
    purchaseDate: "2024-01-01",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides
  });

  describe("canBeDeleted", () => {
    it("利用可能な備品は削除可能", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "利用可能" })
      );

      expect(equipment.canBeDeleted()).toBe(true);
    });

    it("貸出中の備品は削除不可", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "貸出中", borrower: "山田太郎" })
      );

      expect(equipment.canBeDeleted()).toBe(false);
    });

    it("使用中の備品は削除可能", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "使用中" })
      );

      expect(equipment.canBeDeleted()).toBe(true);
    });
  });

  describe("canBeBorrowed", () => {
    it("利用可能で在庫ありの備品は貸出可能", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "利用可能", quantity: 1 })
      );

      expect(equipment.canBeBorrowed()).toBe(true);
    });

    it("貸出中の備品は貸出不可", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "貸出中", borrower: "山田太郎" })
      );

      expect(equipment.canBeBorrowed()).toBe(false);
    });

    it("在庫0の備品は貸出不可", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "利用可能", quantity: 0 })
      );

      expect(equipment.canBeBorrowed()).toBe(false);
    });
  });

  describe("hasConsistentData", () => {
    it("貸出中で使用者がいる場合は整合性あり", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "貸出中", borrower: "山田太郎" })
      );

      expect(equipment.hasConsistentData()).toBe(true);
    });

    it("貸出中で使用者がいない場合は整合性なし", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "貸出中", borrower: "" })
      );

      expect(equipment.hasConsistentData()).toBe(false);
    });

    it("使用中で使用者がいる場合は整合性あり", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "使用中", borrower: "山田太郎" })
      );

      expect(equipment.hasConsistentData()).toBe(true);
    });

    it("使用中で使用者がいない場合も整合性あり", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "使用中", borrower: "" })
      );

      expect(equipment.hasConsistentData()).toBe(true);
    });

    it("利用可能で使用者がいない場合は整合性あり", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "利用可能", borrower: "" })
      );

      expect(equipment.hasConsistentData()).toBe(true);
    });

    it("利用可能で使用者がいる場合も整合性あり（警告レベル）", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "利用可能", borrower: "山田太郎" })
      );

      expect(equipment.hasConsistentData()).toBe(true);
    });
  });
});
