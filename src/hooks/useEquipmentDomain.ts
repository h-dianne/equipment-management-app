// src/hooks/useEquipmentDomain.ts
import {
  useEquipments,
  useDeleteEquipment,
  useEquipmentById
} from "./useEquipment";
import { EquipmentEntity } from "../domain/equipment-entity";

/**
 * ドメインフック: APIフックにビジネスロジックを追加
 *
 * useEquipment.tsを使用してAPIデータを取得し、
 * ドメインエンティティとビジネスインサイトを提供
 */
export const useEquipmentDomain = () => {
  // 既存のAPIフックを使用（変更なし）
  const { data, isLoading, error, refetch } = useEquipments();
  const deleteEquipmentMutation = useDeleteEquipment();

  // APIデータをドメインエンティティに変換
  const entities =
    data?.map((equipment) => EquipmentEntity.fromData(equipment)) || [];

  // ビジネスロジックに基づく分析
  const businessInsights = {
    // 削除可能な備品の一覧
    deletableEquipments: entities.filter((entity) => entity.canBeDeleted()),

    // 貸出可能な備品の一覧
    borrowableEquipments: entities.filter((entity) => entity.canBeBorrowed()),

    // 返却可能な備品の一覧
    returnableEquipments: entities.filter((entity) => entity.canBeReturned()),

    // 編集可能な備品の一覧
    editableEquipments: entities.filter((entity) => entity.canBeEdited()),

    // データ不整合の備品（要修正）
    inconsistentEquipments: entities.filter(
      (entity) => !entity.hasConsistentData()
    ),

    // ステータス別の集計
    statusSummary: {
      available: entities.filter((e) => e.status === "利用可能").length,
      borrowed: entities.filter((e) => e.status === "貸出中").length,
      inUse: entities.filter((e) => e.status === "使用中").length,
      disposed: entities.filter((e) => e.status === "廃棄").length,
      total: entities.length
    },

    // カテゴリ別の集計
    categorySummary: entities.reduce((acc, entity) => {
      const category = entity.toData().category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  // ビジネスルールを含む削除関数
  const deleteEquipmentWithBusinessRules = async (entity: EquipmentEntity) => {
    // ビジネスルールチェック
    if (!entity.canBeDeleted()) {
      throw new Error("この備品は削除できません（貸出中のため）");
    }

    // 既存のAPIミューテーションを使用
    return deleteEquipmentMutation.mutateAsync(entity.id);
  };

  // エンティティ検索のヘルパー関数
  const findEntityById = (id: string): EquipmentEntity | undefined => {
    return entities.find((entity) => entity.id === id);
  };

  // ビジネスルールに基づくフィルタリング関数
  const filterByBusinessRule = (rule: (entity: EquipmentEntity) => boolean) => {
    return entities.filter(rule);
  };

  return {
    // 基本データ（既存のAPIフックから）
    entities,
    isLoading,
    error,
    refetch,

    // ビジネスインサイト
    businessInsights,

    // ビジネスロジック付きアクション
    deleteEquipmentWithBusinessRules,

    // ヘルパー関数
    findEntityById,
    filterByBusinessRule,

    // 既存のミューテーション（そのまま利用可能）
    deleteEquipmentMutation
  };
};

/**
 * 単一備品用のドメインフック
 */
export const useEquipmentByIdDomain = (id: string) => {
  // 既存のAPIフックを使用
  const { data, isLoading, error, refetch } = useEquipmentById(id);

  // ドメインエンティティに変換
  const entity = data ? EquipmentEntity.fromData(data) : null;

  // ビジネスロジックに基づく状態
  const businessState = entity
    ? {
        canBeDeleted: entity.canBeDeleted(),
        canBeEdited: entity.canBeEdited(),
        canBeBorrowed: entity.canBeBorrowed(),
        canBeReturned: entity.canBeReturned(),
        hasConsistentData: entity.hasConsistentData()
      }
    : null;

  return {
    entity,
    isLoading,
    error,
    refetch,
    businessState
  };
};

/**
 * ビジネス分析専用フック（データ集計など）
 */
export const useEquipmentAnalytics = () => {
  const { entities, isLoading, businessInsights } = useEquipmentDomain();

  // より詳細な分析
  const analytics = {
    // 基本統計
    ...businessInsights,

    // 利用率
    utilizationRate:
      entities.length > 0
        ? ((businessInsights.statusSummary.borrowed +
            businessInsights.statusSummary.inUse) /
            entities.length) *
          100
        : 0,

    // 問題のある備品の割合
    issueRate:
      entities.length > 0
        ? (businessInsights.inconsistentEquipments.length / entities.length) *
          100
        : 0,

    // カテゴリ別利用状況
    categoryUtilization: Object.entries(businessInsights.categorySummary).map(
      ([category, count]) => ({
        category,
        count,
        percentage: entities.length > 0 ? (count / entities.length) * 100 : 0
      })
    )
  };

  return {
    analytics,
    isLoading
  };
};

/**
 * データ整合性チェック専用フック
 */
export const useEquipmentDataIntegrity = () => {
  const { entities, isLoading } = useEquipmentDomain();

  // データ整合性の詳細チェック
  const integrityCheck = {
    // 不整合な備品
    inconsistentItems: entities.filter((entity) => !entity.hasConsistentData()),

    // 借用者はいるがステータスが貸出中及び使用中でない
    borrowerStatusMismatch: entities.filter((entity) => {
      const data = entity.toData();
      return (
        data.borrower &&
        data.borrower.trim().length > 0 &&
        !["貸出中", "使用中"].includes(data.status)
      );
    }),

    // ステータスが貸出中だが借用者がいない
    statusBorrowerMismatch: entities.filter((entity) => {
      const data = entity.toData();
      return (
        data.status === "貸出中" &&
        (!data.borrower || data.borrower.trim().length === 0)
      );
    }),

    // 在庫数が0以下
    invalidQuantity: entities.filter((entity) => entity.quantity <= 0),

    // 総問題数
    totalIssues: 0
  };

  // 総問題数を計算
  integrityCheck.totalIssues =
    integrityCheck.inconsistentItems.length +
    integrityCheck.invalidQuantity.length;

  return {
    integrityCheck,
    isLoading,
    hasIssues: integrityCheck.totalIssues > 0
  };
};
