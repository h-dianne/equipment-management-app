# 備品管理アプリケーション - ドメイン駆動設計（DDD）実装【学習・実験用】

本ブランチ（`domain-testing`）では、学習と実験を目的として、備品管理アプリケーションにドメイン駆動設計(DDD)のアプローチを適用しています。このブランチでは、ビジネスロジックを UI から分離し、DDD 実装方法の理解を深めるための取り組みとしてテスト実装を行っています。備品の貸出・返却・管理といった業務ロジックを明確に表現するため、従来のコンポーネント中心のテスト手法ではなく、ドメインモデルとユースケースに焦点を当てています。

このアプローチでは、備品の状態管理や業務ルールをドメインエンティティにカプセル化し、それらのビジネスルールを検証するテストを優先的に実装しています。ドメインロジックに焦点を当てたテスト戦略により、アプリケーション全体の堅牢性と保守性を高める方法を探求しています。この README では、本ブランチにおける DDD の実装アプローチとその利点について詳しく解説します。

## 目次

1. [CBA と DDD の比較](#1-cba-と-ddd-の比較)
2. [DDD 実装の概要](#2-ddd-実装の概要)
3. [ドメイン層の実装](#3-ドメイン層の実装)
4. [ユーザーインターフェース（UI）層](#4-ユーザーインターフェースui層)
5. [アプリケーション層（ユースケース）](#5-アプリケーション層ユースケース)
6. [インフラストラクチャ層](#6-インフラストラクチャ層)
7. [ドメインテストの実装](#7-ドメインテストの実装)

## 1. CBA と DDD の比較

本プロジェクトは、元々コンポーネントベースアーキテクチャ(CBA)で実装されていましたが、このブランチでは学習と実験のためにドメイン駆動設計(DDD)のアプローチを取り入れています。DDD 実装方法の理解を深めるための取り組みとして、両者の主な違いは以下の通りです：

### CBA アプローチ（元の実装）

- **重点**: UI コンポーネントとその振る舞い
- **テスト**: コンポーネントの表示と対話に焦点
- **ビジネスロジック**: コンポーネント内に散在
- **責任分離**: コンポーネントごとに機能が分散

### DDD アプローチ（このブランチ）

- **重点**: ビジネスドメインとルール
- **テスト**: ドメインエンティティとビジネスルールに焦点
- **ビジネスロジック**: ドメイン層にカプセル化
- **責任分離**: 明確な層に分かれた責任（ドメイン、アプリケーション、UI、インフラ）

### 利点と欠点

#### DDD の利点

- ビジネスルールが一箇所に集約され、理解しやすい
- ドメインの変更が局所的になり、影響範囲が限定される
- ドメインロジックのテストが容易になる
- UI とビジネスロジックの分離により、UI の変更がビジネスロジックに影響しない

#### DDD の欠点

- 小規模プロジェクトでは過剰な設計になる可能性がある
- 学習曲線が急で、チーム全体が DDD を理解する必要がある
- ボイラープレートコードが増える傾向がある

## 2. DDD 実装の概要

ドメイン駆動設計（DDD）は、複雑なビジネスドメインを理解し、表現するためのアプローチです。備品管理アプリケーション自体は比較的シンプルなドメインですが、より複雑なビジネスドメインに適用する場合の実装方法を学習・実験する目的で、あえて DDD を適用しています。

備品管理という業務ドメインには、備品の登録・貸出・返却・廃棄といった一連のライフサイクルと、それに伴うビジネスルールが存在します。これらのプロセスが複雑な組織では、DDD アプローチの価値が一層高まることを理解するため、本プロジェクトでは以下の層に分けて実装しています：

- **ドメイン層**: 備品のライフサイクルや状態遷移などのビジネスルールとドメインロジックを含む
- **アプリケーション層**: 備品管理のユースケース（一覧表示、詳細表示、登録など）とビジネスフローの調整
- **ユーザーインターフェース層**: 備品管理画面や操作フォームなど、ユーザーとの対話を処理
- **インフラストラクチャ層**: API サーバーとの通信やデータの永続化、型安全な通信処理

## 3. ドメイン層の実装

### 2-1. エンティティと値オブジェクト

```typescript
// src/domain/equipment-entity.ts
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

  // データアクセサー
  get id(): string {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get status(): string {
    return this.data.status;
  }

  // 生データを取得（API送信用）
  toData(): EquipmentData {
    return { ...this.data };
  }
}
```

この実装では、`Equipment`クラスがエンティティとして実装され、ドメインロジックをカプセル化しています。各メソッドは、備品に関連するビジネスルールを表現しています。

### 2-2. ドメインサービス

ドメインサービスは、複数のエンティティにまたがる操作や、エンティティ自体に属さない操作を表現します。

```typescript
// src/domain/equipment-service.ts（概念実装）
export class EquipmentService {
  validateEquipmentName(name: string): boolean {
    // 備品名のバリデーションロジック
    return name.length > 0 && name.length <= 100;
  }

  // 特定カテゴリの備品数をカウント
  countByCategory(
    equipments: Equipment[],
    category: EquipmentCategory
  ): number {
    return equipments.filter((e) => e.category === category).length;
  }
}
```

## 4. ユーザーインターフェース（UI）層

UI コンポーネントは純粋な表示ロジックに集中し、ビジネスロジックはドメイン層とアプリケーション層に委譲します。React Hook Form によるフォーム管理と Zustand によるグローバルステートを活用して、ユーザー体験を向上させつつ、ドメインロジックとの明確な分離を実現しています。

```tsx
// src/pages/DetailPage.tsx
const DetailPage = () => {
  // URL から id パラメータを取得
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // グローバルステートを使用
  const { selectEquipment, addToRecentlyViewed } = useEquipmentStore();

  // id を使って特定の備品データを取得
  const { data, isLoading, isError } = useEquipmentById(id || "");

  // データがロードされたら、グローバルステートを更新
  useEffect(() => {
    if (data) {
      selectEquipment(data);
      addToRecentlyViewed(data.id);
    }
    // アンマウント時に選択された備品をクリア
    return () => {
      selectEquipment(null);
    };
  }, [data, selectEquipment, addToRecentlyViewed]);

  // ローディング、エラー処理、レンダリングロジック
  // ...
};
```

## 5. アプリケーション層（ユースケース）

アプリケーション層は、UI とドメイン層の橋渡しをするレイヤーです。備品管理システムでは、「一覧表示」「詳細表示」「登録」「編集」「削除」「貸出」「返却」といった各ユースケースを明確に定義しています。React Hooks を活用してユースケースを実装し、ドメインエンティティとのやり取りを調整しています。これにより、同じビジネスロジックを複数の UI コンポーネントから一貫して利用できます。

```typescript
// src/hooks/useEquipmentDomain.ts (簡略化)
export const useEquipmentDomain = () => {
  // APIフックから基本データを取得
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
    // ステータス別の集計
    statusSummary: {
      available: entities.filter((e) => e.status === "利用可能").length,
      borrowed: entities.filter((e) => e.status === "貸出中").length
      // ...その他の集計
    }
    // ...より多くのビジネスインサイト
  };

  // ビジネスロジックを含む削除関数
  const deleteEquipmentWithBusinessRules = async (entity: EquipmentEntity) => {
    // ビジネスルールチェック
    if (!entity.canBeDeleted()) {
      throw new Error("この備品は削除できません（貸出中のため）");
    }
    // 既存のAPIミューテーションを使用
    return deleteEquipmentMutation.mutateAsync(entity.id);
  };

  // ...その他のメソッド
};
```

### ドメインロジックを取り入れたフォームバリデーション

フォームバリデーションとビジネスルールの検証をドメインエンティティと統合しています。

```typescript
// src/hooks/useEquipmentFormDomain.ts (簡略化)
export const useEquipmentFormDomain = () => {
  const navigate = useNavigate();
  const { mutate: createEquipment, isPending } = useCreateEquipment();

  // フォーム状態
  const [formData, setFormData] = useState<Partial<CreateEquipmentInput>>(
    () => EquipmentEntity.getFormDefaults()
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // フォーム全体のバリデーション
  const validateForm = useCallback((): ValidationResult => {
    const result = EquipmentEntity.validateFormData(formData);
    // ...エラー処理ロジック
    return result;
  }, [formData]);

  // フォーム送信
  const submitForm = useCallback(async () => {
    // バリデーション実行
    const validation = validateForm();
    if (!validation.isValid) {
      toast.error("入力内容に誤りがあります。確認してください。");
      return;
    }

    try {
      // ドメインロジックでデータを整形
      const submissionData = EquipmentEntity.prepareForSubmission(
        formData as CreateEquipmentInput
      );
      // API送信
      createEquipment(submissionData, {
        onSuccess: () => {
          toast.success("備品を登録しました");
          resetForm();
          navigate("/");
        }
      });
    } catch (error) {
      // エラー処理
    }
  }, [formData, validateForm, createEquipment, navigate]);

  // ビジネスインサイト
  const businessInsights = {
    // データ整合性チェック
    isDataConsistent: /* ...データ整合性ロジック */,
    // 警告があるかどうか
    hasWarnings: /* ...警告チェックロジック */
  };

  return {
    formData,
    errors,
    isSubmitting: isPending,
    // ...その他の状態とメソッド
  };
};
```

## 6. インフラストラクチャ層

インフラストラクチャ層は、API サーバーとのやり取りを担当します。備品管理 API との通信処理、データの永続化、型安全なデータ検証などを担います。特に Zod を活用した実行時バリデーションにより、API 通信で発生しうるデータの不整合を早期に検出し、アプリケーションの堅牢性を高めています。

```typescript
// src/api/equipmentApi.ts
import { z } from "zod";
import { apiClient } from "./client";

// Zodスキーマによる型定義と実行時バリデーション
export const EquipmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "備品名は必須です"),
  category: z.enum([
    "電子機器",
    "オフィス家具",
    "工具・作業用品",
    "AV機器・周辺機器",
    "消耗品",
    "防災・安全用品",
    "レンタル備品",
    "社用車関連品"
  ] as const),
  status: z.enum(["使用中", "貸出中", "利用可能", "廃棄"] as const),
  quantity: z.number().min(0, "在庫数は0以上である必要があります"),
  storageLocation: z.string().min(1, "保管場所は必須です"),
  purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  borrower: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  notes: z.string().optional()
});

// スキーマから型を導出
export type Equipment = z.infer<typeof EquipmentSchema>;
export type EquipmentCategory = Equipment["category"];
export type EquipmentStatus = Equipment["status"];

// バリデーション付きAPIリクエスト関数
export const fetchEquipment = async (): Promise<Equipment[]> => {
  const { data } = await apiClient.get("/equipments");
  // 実行時バリデーション - APIレスポンスが期待する型と一致するか検証
  try {
    return EquipmentsSchema.parse(data);
  } catch (error) {
    return handleValidationError(error);
  }
};

// 他のAPI関数も同様にバリデーション処理を実装
// - fetchEquipmentById
// - createEquipment
// - updateEquipment
// - deleteEquipment

// ユーティリティ関数
export const isEquipment = (data: unknown): data is Equipment => {
  try {
    EquipmentSchema.parse(data);
    return true;
  } catch {
    return false;
  }
};
```

## 7. ドメインテストの実装

本ブランチでは、ドメインエンティティとそのビジネスルールに対する包括的なテストを実装しています。UI 表示やコンポーネントの振る舞いではなく、備品管理のコアとなる業務ロジックの正確性を検証することに重点を置いています。これにより、UI が変更されても、基盤となるビジネスロジックの正確性を維持することができます。

### 6-1. エンティティのテスト

```typescript
// src/tests/domain/equipment-entity.test.ts
import { describe, it, expect } from "vitest";
import { EquipmentEntity } from "../../domain/equipment-entity";
import { Equipment } from "../../types/equipment";

describe("EquipmentEntity", () => {
  // テスト用データ生成のヘルパー関数
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

    // その他のテスト...
  });

  describe("canBeBorrowed", () => {
    it("利用可能で在庫ありの備品は貸出可能", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "利用可能", quantity: 1 })
      );
      expect(equipment.canBeBorrowed()).toBe(true);
    });

    it("在庫0の備品は貸出不可", () => {
      const equipment = EquipmentEntity.fromData(
        createTestEquipment({ status: "利用可能", quantity: 0 })
      );
      expect(equipment.canBeBorrowed()).toBe(false);
    });

    // その他のテスト...
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

    // その他のテスト...
  });
});
```

### 6-2. フォームバリデーションのテスト

実際のアプリケーションでは、EquipmentEntity クラスにフォーム入力のバリデーションロジックを集約し、以下のような検証機能を実装しています。

```typescript
// src/tests/domain/equipment-form-validation.test.ts
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
      // 他のエラー検証...
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

      expect(prepared.name).toBe("テスト備品");
      expect(prepared.storageLocation).toBe("オフィスA");
      expect(prepared.borrower).toBeUndefined();
      expect(prepared.notes).toBeUndefined();
    });
  });
});
```
