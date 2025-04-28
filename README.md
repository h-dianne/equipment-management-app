# 備品管理アプリケーション

## 目的

React、TypeScript、および最新のフロントエンド技術スタック（axios、React Query、zod など）を使用して、実践的な備品管理アプリケーションを開発することにより、
API 通信、データキャッシュ管理、バリデーション、状態管理の基本スキルを習得することです。

また、実際の開発現場に必要な「型安全性」や「エラーハンドリング」などのベストプラクティスを身につけることも目的としています。

---

## Task 1. Web API の適切な呼び出しと実装方法の習得

このプロジェクトでは、以下のライブラリを使用して API 通信とデータキャッシュを実装しました：

- **axios**: HTTP 通信を行うためのクライアントライブラリ
- **@tanstack/react-query**: サーバーデータの取得、キャッシング、同期化
- **zod**: スキーマ検証と型安全性の確保
- **react-hot-toast**: ユーザーフレンドリーな通知システム

以下は、各検証項目ごとの実装内容です。

### 1. API リクエストとキャッシュの基本実装

#### axios を使った API リクエストの送信とデータキャッシュの実装

```typescript
// src/api/equipment.ts から抜粋
export const fetchEquipment = async (): Promise<Equipment[]> => {
  try {
    // サーバーから何が返ってくるかわからないため、一旦 unknown として受け取る
    const response = await axios.get<unknown>(`${API_BASE_URL}/api/equipments`);
    // 実行時に zod を使って正しいデータ構造かを検証する
    return EquipmentsSchema.parse(response.data);
  } catch () {
    toast.error("備品データの取得に失敗しました");
    throw new Error("Failed to fetch equipment data");
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

> TypeScript の型は開発時のヒントにすぎないため、実行時には unknown として受け取り、zod で検証することで不正なレスポンスによるクラッシュを防ぎます。

axios を使用して API リクエストを送信し、React Query の`useQuery`フックを使用してデータのキャッシングを実装しています。これにより、同じデータに対する複数のリクエストが最適化され、不要なネットワーク通信を削減できます。

---

### 2. クエリキーの設計とキャッシュ管理

#### クエリキーの命名規則と設計指針

```typescript
// src/hooks/useEquipment.ts から抜粋
export const equipmentKeys = {
  all: ["equipments"] as const,
  details: (id: string) => [...equipmentKeys.all, id] as const
};
```

クエリキーは階層構造を持ち、関連データをグループ化しています。この設計により、特定のキーや関連するキーのグループを簡単に無効化できます。

#### キャッシュの有効期限設定

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

#### キャッシュの無効化と再取得の実装

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

### 3. データの検証と型安全性

#### zod によるレスポンスのバリデーション

```typescript
// src/api/equipment.ts から抜粋
export const EquipmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  status: z.enum(["使用中", "貸出中", "利用可能", "廃棄"]),
  quantity: z.number(),
  storageLocation: z.string(),
  purchaseDate: z.string(),
  borrower: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  notes: z.string().optional()
});

export const EquipmentsSchema = z.array(EquipmentSchema);
```

zod を使用してスキーマを定義し、API レスポンスを検証しています。これにより、実行時にデータ構造の整合性を確認できます。

#### 型の自動生成と型安全性の確保

```typescript
// src/api/equipment.ts から抜粋
export type Equipment = z.infer<typeof EquipmentSchema>;
export type Equipments = z.infer<typeof EquipmentsSchema>;
```

`z.infer`を使用して、zod スキーマから TypeScript の型を自動生成しています。これにより、スキーマと型定義の同期が保たれ、型安全性が向上します。

---

### 4. データ操作と状態管理

#### データ取得（useQuery）の実装

```typescript
// src/hooks/useEquipment.ts から抜粋
export const useEquipments = () => {
  return useQuery({
    queryKey: equipmentKeys.all,
    queryFn: fetchEquipment
  });
};
```

React Query の`useQuery`フックを使用して、データ取得とキャッシュ管理を実装しています。このフックはローディング状態、エラー状態、成功状態、データを含むオブジェクトを返します。

#### データの作成、更新、削除（useMutation）の実装

```typescript
// src/hooks/useEquipment.ts から抜粋
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    }
  });
};

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEquipment,
    onSuccess: (data) => {
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
      queryClient.removeQueries({ queryKey: equipmentKeys.details(variables) });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    }
  });
};
```

React Query の`useMutation`フックを使用して、データの作成、更新、削除操作を実装しています。各ミューテーションは成功時にキャッシュを適切に更新し、UI が最新のデータを反映するようにしています。

---

### 5. エラーハンドリングと UI 状態管理

#### トーストによるエラー通知の実装

```typescript
// src/api/equipment.ts から抜粋
export const fetchEquipment = async (): Promise<Equipment[]> => {
  try {
    // ...
  } catch (error) {
    toast.error("備品データの取得に失敗しました");
    throw new Error("Failed to fetch equipment data");
  }
};
```

各 API 関数では、try-catch 構文を使用してエラーをキャッチし、react-hot-toast ライブラリを使用してユーザーフレンドリーな通知を表示しています。これにより、ユーザーはエラーをすぐに認識できます。

#### ローディング、エラー、成功状態の UI 制御

```tsx
// src/pages/EquipmentList.tsx から抜粋
const EquipmentList = () => {
  const { data, isLoading, isError, error, isSuccess, refetch } =
    useEquipments();

  // 初回データ読み込み成功時にトースト通知を表示
  useEffect(() => {
    if (isSuccess && data.length > 0) {
      toast.success("備品データを読み込みました");
    }
  }, [isSuccess, data]);

  if (isLoading) {
    return <LoadingState />;
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

## 開発環境の準備

```bash
# 依存パッケージのインストール
yarn install

# 開発サーバーの起動
yarn dev
```
