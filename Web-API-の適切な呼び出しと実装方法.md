# Task 1. Web API の適切な呼び出しと実装方法

このプロジェクトでは、以下のライブラリを使用して API 通信とデータキャッシュを実装しました：

- [**axios**](https://axios-http.com/ja/docs/intro): HTTP 通信を行うためのクライアントライブラリ
- [**@tanstack/react-query**](https://tanstack.com/query/latest/docs/framework/react/overview): サーバーデータの取得、キャッシング、同期化
- [**zod**](https://zod.dev/?id=introduction): スキーマ検証と型安全性の確保
- [**react-hot-toast**](https://react-hot-toast.com/docs): ユーザーフレンドリーな通知システム

以下は、各検証項目ごとの実装内容です。

## Task 1-1. API リクエストとキャッシュの基本実装

### axios を使った API リクエストの送信とデータキャッシュの実装

#### axios インスタンスの設定

一貫した API 通信のために設定済みの axios インスタンスを作成しています：

```typescript
// src/api/client.ts
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

// APIのベースURL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// カスタムエラー型の定義
type ApiErrorResponse = {
  message?: string;
  error?: string;
  statusCode?: number;
};

// デフォルト設定でaxiosインスタンスを作成
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10秒のタイムアウト
  headers: {
    "Content-Type": "application/json"
  }
});

// リクエストインターセプター - 全てのリクエスト前に実行
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => Promise.reject(error)
);

// レスポンスインターセプター - 全てのレスポンス後に実行
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // 一般的なエラーシナリオを処理
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      const message =
        errorData?.message || errorData?.error || "エラーが発生しました";

      switch (status) {
        case 400:
          toast.error(`無効なリクエストです: ${message}`);
          break;
        case 401:
          toast.error("認証が必要です");
          break;
        case 403:
          toast.error("アクセス権限がありません");
          break;
        case 404:
          toast.error("データが見つかりません");
          break;
        case 422:
          toast.error(`入力内容に誤りがあります: ${message}`);
          break;
        case 500:
          toast.error("サーバーエラーが発生しました");
          break;
        case 503:
          toast.error("サービスが一時的に利用できません");
          break;
        default:
          toast.error(`エラーが発生しました: ${message}`);
      }
    } else if (error.request) {
      toast.error(
        "サーバーに接続できません。ネットワーク接続を確認してください。"
      );
    } else {
      toast.error(`予期しないエラーが発生しました: ${error.message}`);
    }
    return Promise.reject(error);
  }
);
```

#### API 関数の実装

設定済みの axios インスタンスを使用して API 関数を実装しています：

```typescript
// src/api/equipmentApi.ts から抜粋
import { apiClient } from "./client";

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

// src/hooks/useEquipment.ts から抜粋
export const useEquipments = () => {
  return useQuery({
    queryKey: equipmentKeys.all,
    queryFn: fetchEquipment
  });
};
```

> **axios インスタンスの利点:**
>
> - **統一された設定**: ベース URL、タイムアウト、ヘッダーなどを一箇所で管理
> - **インターセプター**: リクエスト/レスポンスの前後で共通処理を実行
> - **エラーハンドリング**: 一貫したエラー処理とユーザー通知
> - **認証機能**: 将来的な認証トークンの追加が容易

axios を使用して API リクエストを送信し、React Query の`useQuery`フックを使用してデータのキャッシングを実装しています。これにより、同じデータに対する複数のリクエストが最適化され、不要なネットワーク通信を削減できます。

---

## Task 1-2. クエリキーの設計とキャッシュ管理

### クエリキーの命名規則と設計指針

```typescript
// src/hooks/useEquipment.ts から抜粋
export const equipmentKeys = {
  all: ["equipments"] as const,
  details: (id: string) => [...equipmentKeys.all, id] as const
};
```

クエリキーは階層構造を持ち、関連データをグループ化しています。この設計により、特定のキーや関連するキーのグループを簡単に無効化できます。

### キャッシュの有効期限設定

```typescript
// src/main.tsx から抜粋
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分間はデータを再取得しない
      refetchOnWindowFocus: false, // フォーカス時の再取得を無効化
      retry: 1 // エラー時は1回だけ再試行
    }
  }
});
```

`staleTime`を 5 分に設定することで、5 分間はデータが新鮮とみなされ、不要な再取得を防ぎます。`refetchOnWindowFocus`を false にすることで、ウィンドウがフォーカスを取得した際の自動再取得を無効化しています。

### キャッシュの無効化と再取得の実装

```typescript
// src/hooks/useEquipment.ts から抜粋
export const useInvalidateEquipments = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
  };
};

export const useRefetchEquipments = () => {
  const queryClient = useQueryClient();

  return () => {
    return queryClient.refetchQueries({ queryKey: equipmentKeys.all });
  };
};
```

`invalidateQueries`を使用してキャッシュを無効化し、`refetchQueries`を使用して明示的にデータを再取得する関数を実装しています。これらの関数はユーザーアクションやデータ更新後に呼び出すことができます。

---

## Task 1-3. データの検証と型安全性

### zod によるレスポンスのバリデーション

```typescript
// src/api/equipmentApi.ts から抜粋
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
  purchaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "日付はYYYY-MM-DD形式である必要があります"),
  borrower: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  notes: z.string().optional()
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
```

zod を使用してスキーマを定義し、API レスポンスを検証しています。これにより、実行時にデータ構造の整合性を確認できます。
また、作成用と更新用の別々のスキーマも定義し、適切なバリデーションを行っています。

### 型の自動生成と型安全性の確保

```typescript
// src/api/equipmentApi.ts から抜粋
export type Equipment = z.infer<typeof EquipmentSchema>;
export type Equipments = z.infer<typeof EquipmentsSchema>;
export type CreateEquipmentInput = z.infer<typeof CreateEquipmentSchema>;
export type UpdateEquipmentInput = z.infer<typeof UpdateEquipmentSchema>;
export type EquipmentCategory = Equipment["category"];
export type EquipmentStatus = Equipment["status"];
```

`z.infer`を使用して、zod スキーマから TypeScript の型を自動生成しています。これにより、スキーマと型定義の同期が保たれ、型安全性が向上します。

### バリデーションエラーハンドリング

```typescript
// src/api/equipmentApi.ts から抜粋
export class ValidationError extends Error {
  constructor(public errors: z.ZodError) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}

const handleValidationError = (error: unknown): never => {
  if (error instanceof z.ZodError) {
    console.error("Validation errors:", error.errors);
    throw new ValidationError(error);
  }
  throw error;
};
```

カスタムエラークラスを定義し、zod のバリデーションエラーを適切にハンドリングしています。

---

## Task 1-4. データ操作と状態管理

### データ取得（useQuery）の実装

```typescript
// src/hooks/useEquipment.ts から抜粋
export const useEquipments = () => {
  return useQuery({
    queryKey: equipmentKeys.all,
    queryFn: fetchEquipment
  });
};

export const useEquipmentById = (id: string) => {
  return useQuery({
    queryKey: equipmentKeys.details(id),
    queryFn: () => fetchEquipmentById(id),
    enabled: !!id
  });
};
```

React Query の`useQuery`フックを使用して、データ取得とキャッシュ管理を実装しています。このフックはローディング状態、エラー状態、成功状態、データを含むオブジェクトを返します。

> [公式ドキュメントはこちら](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)

### データの作成、更新、削除（useMutation）の実装

```typescript
// src/hooks/useEquipment.ts から抜粋
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEquipment,
    onSuccess: () => {
      // 成功時にキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    }
  });
};

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: string;
      data: Partial<Omit<Equipment, "id" | "createdAt" | "updatedAt">>;
    }) => updateEquipment(params.id, params.data),
    onSuccess: (data) => {
      // 成功時に特定の備品と全体のリストを更新
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.details(data.id)
      });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    }
  });
};

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEquipment,
    onSuccess: (_, variables) => {
      // 成功時にキャッシュから削除した備品を除去
      queryClient.removeQueries({ queryKey: equipmentKeys.details(variables) });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    }
  });
};
```

React Query の`useMutation`フックを使用して、データの作成、更新、削除操作を実装しています。各ミューテーションは成功時にキャッシュを適切に更新し、UI が最新のデータを反映するようにしています。

> [公式ドキュメントはこちら](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)

---

## Task 1-5. エラーハンドリングと UI 状態管理

### 統合されたエラーハンドリング

エラーハンドリングは axios インターセプターで統一的に処理され、react-hot-toast ライブラリを使用して通知を表示しています：

```typescript
// src/api/client.ts のレスポンスインターセプターから抜粋
(error: AxiosError<ApiErrorResponse>) => {
  if (error.response) {
    const status = error.response.status;
    const errorData = error.response.data;
    const message =
      errorData?.message || errorData?.error || "エラーが発生しました";

    switch (status) {
      case 400:
        toast.error(`無効なリクエストです: ${message}`);
        break;
      case 422:
        toast.error(`入力内容に誤りがあります: ${message}`);
        break;
      // その他のステータスコード処理...
    }
  }
  return Promise.reject(error);
};
```

### ローディング、エラー、成功状態の UI 制御

React Query が提供する状態フラグを使用して、データの状態に応じた UI の表示を制御しています：

```tsx
// コンポーネントでの使用例
const EquipmentList = () => {
  const { data, isLoading, isError, error, isSuccess, refetch } =
    useEquipments();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (isSuccess && (!data || data.length === 0)) {
    return <EmptyState />;
  }

  return <SuccessState data={data} onRefresh={refetch} />;
};
```

React Query が提供する`isLoading`、`isError`、`isSuccess`などの状態フラグを使用して、データの状態に応じた UI の表示を制御しています。また、`refetch`関数を使用して、ユーザーが明示的にデータを再取得できるボタンを追加しています。
