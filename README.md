# 備品管理アプリケーション

## 目次

- [備品管理アプリケーション](#備品管理アプリケーション)
  - [目次](#目次)
  - [1. 目的](#1-目的)
  - [2. 開発環境の準備](#2-開発環境の準備)
  - [3. Task 1. Web API の適切な呼び出しと実装方法の習得](#3-task-1-web-api-の適切な呼び出しと実装方法の習得)
    - [3-1. Task 1-1. API リクエストとキャッシュの基本実装](#3-1-task-1-1-api-リクエストとキャッシュの基本実装)
      - [axios を使った API リクエストの送信とデータキャッシュの実装](#axios-を使った-api-リクエストの送信とデータキャッシュの実装)
        - [axios インスタンスの設定](#axios-インスタンスの設定)
        - [API 関数の実装](#api-関数の実装)
    - [3-2. Task 1-2. クエリキーの設計とキャッシュ管理](#3-2-task-1-2-クエリキーの設計とキャッシュ管理)
      - [クエリキーの命名規則と設計指針](#クエリキーの命名規則と設計指針)
      - [キャッシュの有効期限設定](#キャッシュの有効期限設定)
      - [キャッシュの無効化と再取得の実装](#キャッシュの無効化と再取得の実装)
    - [3-3. Task 1-3. データの検証と型安全性](#3-3-task-1-3-データの検証と型安全性)
      - [zod によるレスポンスのバリデーション](#zod-によるレスポンスのバリデーション)
      - [型の自動生成と型安全性の確保](#型の自動生成と型安全性の確保)
      - [バリデーションエラーハンドリング](#バリデーションエラーハンドリング)
    - [3-4. Task 1-4. データ操作と状態管理](#3-4-task-1-4-データ操作と状態管理)
      - [データ取得（useQuery）の実装](#データ取得usequeryの実装)
      - [データの作成、更新、削除（useMutation）の実装](#データの作成更新削除usemutationの実装)
    - [3-5. Task 1-5. エラーハンドリングと UI 状態管理](#3-5-task-1-5-エラーハンドリングと-ui-状態管理)
      - [統合されたエラーハンドリング](#統合されたエラーハンドリング)
      - [ローディング、エラー、成功状態の UI 制御](#ローディングエラー成功状態の-ui-制御)
  - [4. Task 2. フォームの制御と入力検証の実装方法の習得](#4-task-2-フォームの制御と入力検証の実装方法の習得)
    - [4-1. Task 2-1. フォーム制御と状態管理](#4-1-task-2-1-フォーム制御と状態管理)
      - [useForm フックによるフォーム状態管理](#useform-フックによるフォーム状態管理)
      - [フォームの送信処理](#フォームの送信処理)
    - [4-2. Task 2-2. zod によるスキーマバリデーション](#4-2-task-2-2-zod-によるスキーマバリデーション)
      - [バリデーションスキーマの定義](#バリデーションスキーマの定義)
      - [zodResolver によるバリデーションの統合](#zodresolver-によるバリデーションの統合)
    - [4-3. Task 2-3. エラーメッセージの表示](#4-3-task-2-3-エラーメッセージの表示)
      - [フィールドごとのエラーメッセージ表示](#フィールドごとのエラーメッセージ表示)
    - [4-4. Task 2-4. 初期値の設定とフォームのリセット](#4-4-task-2-4-初期値の設定とフォームのリセット)
      - [デフォルト値の設定](#デフォルト値の設定)
      - [フォームのリセット機能](#フォームのリセット機能)
    - [4-5. Task 2-5. フォームのバリデーションタイミングの違い](#4-5-task-2-5-フォームのバリデーションタイミングの違い)
  - [5. Task 3. ページ遷移（ルーティング）の実装方法の習得](#5-task-3-ページ遷移ルーティングの実装方法の習得)
    - [5-1. Task 3-1. 基本的なルート定義と`<Route>`コンポーネントの使用方法](#5-1-task-3-1-基本的なルート定義とrouteコンポーネントの使用方法)
      - [ルート定義と階層構造](#ルート定義と階層構造)
    - [5-2. Task 3-2. 動的ルートパラメータとクエリパラメータの取得方法](#5-2-task-3-2-動的ルートパラメータとクエリパラメータの取得方法)
      - [動的ルートパラメータの取得](#動的ルートパラメータの取得)
      - [クエリパラメータの取得](#クエリパラメータの取得)
    - [5-3. Task 3-3. ネストされたルーティングとレイアウト構成](#5-3-task-3-3-ネストされたルーティングとレイアウト構成)
      - [共通レイアウトの実装](#共通レイアウトの実装)
    - [5-4. Task 3-4. `<Outlet>`コンポーネントの使用](#5-4-task-3-4-outletコンポーネントの使用)
    - [5-5. Task 3-5. ナビゲーション（useNavigate, `<Link>`）の実装](#5-5-task-3-5-ナビゲーションusenavigate-linkの実装)
      - [宣言的なナビゲーション（`<Link>`）](#宣言的なナビゲーションlink)
      - [プログラムによるナビゲーション（useNavigate）](#プログラムによるナビゲーションusenavigate)
  - [6. Task 4. グローバルステート管理の実装方法の習得](#6-task-4-グローバルステート管理の実装方法の習得)
    - [6-1. グローバルステート管理とは](#6-1-グローバルステート管理とは)
    - [6-2. Redux と Zustand の違い](#6-2-redux-と-zustand-の違い)
    - [6-3. Task 4-1. ストアの定義と利用（create, useStore）](#6-3-task-4-1-ストアの定義と利用create-usestore)
      - [基本的なストア作成](#基本的なストア作成)
      - [コンポーネントでのストア利用](#コンポーネントでのストア利用)
    - [6-4. Task 4-2. ステートの読み取りと更新](#6-4-task-4-2-ステートの読み取りと更新)
      - [単純なステート更新](#単純なステート更新)
      - [コンポーネントでのステート読み取り](#コンポーネントでのステート読み取り)
      - [前の状態を参照する複雑な更新](#前の状態を参照する複雑な更新)
    - [6-5. Task 4-3. ストアの分割とモジュール化](#6-5-task-4-3-ストアの分割とモジュール化)
      - [機能ごとのストア分割](#機能ごとのストア分割)
    - [6-6. Task 4-4. React DevTools との連携とデバッグ](#6-6-task-4-4-react-devtools-との連携とデバッグ)
      - [devtools ミドルウェアの統合](#devtools-ミドルウェアの統合)
      - [アクション名のラベル付け](#アクション名のラベル付け)
      - [デバッグの利用方法](#デバッグの利用方法)
  - [7. Task 5. テストの実行と検証方法の習得](#7-task-5-テストの実行と検証方法の習得)
    - [7-1. テストのセットアップ方法](#7-1-テストのセットアップ方法)
      - [src/tests/setup.ts について](#srctestssetupts-について)
      - [vitest.config.ts について](#vitestconfigts-について)
    - [7-2. 便利な拡張機能とショートカット](#7-2-便利な拡張機能とショートカット)
      - [VS Code 拡張機能](#vs-code-拡張機能)
      - [よく使うスニペットショートカット](#よく使うスニペットショートカット)
      - [便利なマッチャー一覧](#便利なマッチャー一覧)
    - [7-3. テストするポイント](#7-3-テストするポイント)
    - [7-4. テストの実行方法](#7-4-テストの実行方法)
    - [7-5. Task 5-1. コンポーネントのユニットテストとスナップショットテスト](#7-5-task-5-1-コンポーネントのユニットテストとスナップショットテスト)
      - [基本的なコンポーネントテスト](#基本的なコンポーネントテスト)
      - [スナップショットテスト](#スナップショットテスト)
    - [例（Navbar.test.tsx.snap）](#例navbartesttsxsnap)
    - [7-6. Task 5-2. ユーザーイベント（クリック、入力、送信など）のテスト](#7-6-task-5-2-ユーザーイベントクリック入力送信などのテスト)
      - [クリックイベントのテスト](#クリックイベントのテスト)
    - [7-7. Task 5-3. フォームの入力とバリデーションエラーのテスト](#7-7-task-5-3-フォームの入力とバリデーションエラーのテスト)
    - [7-8. Task 5-4. API 呼び出しを含む非同期処理のテスト（waitFor, mock）](#7-8-task-5-4-api-呼び出しを含む非同期処理のテストwaitfor-mock)

## 1. 目的

React、TypeScript、および最新のフロントエンド技術スタック（axios、React Query、zod など）を使用して、実践的な備品管理アプリケーションを開発することにより、
API 通信、データキャッシュ管理、バリデーション、状態管理の基本スキルを習得することです。

また、実際の開発現場に必要な「型安全性」や「エラーハンドリング」などのベストプラクティスを身につけることも目的としています。

## 2. 開発環境の準備

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動（フロントエンドのみ）
npm run dev

# モックAPIサーバーの起動（別ターミナルで実行）
npm run api

# 開発サーバーとモックAPIサーバーを同時に起動
npm run dev:all
```

---

## 3. Task 1. Web API の適切な呼び出しと実装方法の習得

このプロジェクトでは、以下のライブラリを使用して API 通信とデータキャッシュを実装しました：

- [**axios**](https://axios-http.com/ja/docs/intro): HTTP 通信を行うためのクライアントライブラリ
- [**@tanstack/react-query**](https://tanstack.com/query/latest/docs/framework/react/overview): サーバーデータの取得、キャッシング、同期化
- [**zod**](https://zod.dev/?id=introduction): スキーマ検証と型安全性の確保
- [**react-hot-toast**](https://react-hot-toast.com/docs): ユーザーフレンドリーな通知システム

以下は、各検証項目ごとの実装内容です。

### 3-1. Task 1-1. API リクエストとキャッシュの基本実装

#### axios を使った API リクエストの送信とデータキャッシュの実装

##### axios インスタンスの設定

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

##### API 関数の実装

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

### 3-2. Task 1-2. クエリキーの設計とキャッシュ管理

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

### 3-3. Task 1-3. データの検証と型安全性

#### zod によるレスポンスのバリデーション

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

#### 型の自動生成と型安全性の確保

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

#### バリデーションエラーハンドリング

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

### 3-4. Task 1-4. データ操作と状態管理

#### データ取得（useQuery）の実装

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

#### データの作成、更新、削除（useMutation）の実装

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

### 3-5. Task 1-5. エラーハンドリングと UI 状態管理

#### 統合されたエラーハンドリング

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

#### ローディング、エラー、成功状態の UI 制御

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

---

## 4. Task 2. フォームの制御と入力検証の実装方法の習得

このプロジェクトでは、以下のライブラリを使用してフォーム制御と入力検証を実装しました：

- [**react-hook-form**](https://react-hook-form.com/): パフォーマンスと使いやすさを重視したフォーム状態管理ライブラリ
- [**zod**](https://zod.dev/?id=introduction): スキーマベースの入力検証ライブラリ
- [**@hookform/resolvers/zod**](https://github.com/react-hook-form/resolvers#zod): react-hook-form と zod を接続するリゾルバー

以下は、各検証項目ごとの実装内容です。

### 4-1. Task 2-1. フォーム制御と状態管理

#### useForm フックによるフォーム状態管理

```typescript
// src/components/equipment/EquipmentForm.tsx から抜粋
const {
  register,
  handleSubmit,
  reset,
  formState: { errors }
} = useForm<EquipmentFormData>({
  resolver: zodResolver(equipmentFormSchema), // Zodスキーマをバリデーション用に接続
  mode: "onBlur", // フォーカスを失った時にバリデーション
  defaultValues: {
    category: "AV機器・周辺機器",
    status: "利用可能",
    quantity: 1,
    purchaseDate: new Date().toISOString().split("T")[0]
  }
});
```

このプロジェクトでは、`react-hook-form` の非制御コンポーネントアプローチを採用しています。`register` 関数を使用して直接 DOM 要素を登録することで、React の状態更新を介さずにフォームの値を管理しています。

これにより以下の利点があります：

1. **パフォーマンスの向上:** 入力ごとの再レンダリングが発生しないため、大規模なフォームでも高速に動作します
2. **実装の簡素化:**`Controller` コンポーネントや個別の `onChange` ハンドラが不要となり、コードが簡潔になります
3. **メモリ効率:** React の状態を介さないため、メモリ使用量が削減されます

標準的な HTML 入力要素では、この `register` アプローチで十分機能します。サードパーティのコンポーネントライブラリやカスタム入力コンポーネントが必要な場合のみ、`Controller` コンポーネントの使用を検討します。

#### フォームの送信処理

```typescript
// src/components/equipment/EquipmentForm.tsx から抜粋
const onSubmit = (data: EquipmentFormData) => {
  mutate(data, {
    onSuccess: () => {
      reset();
      navigate("/");
    }
  });
};

return (
  <form onSubmit={handleSubmit(onSubmit)} className="p-6">
    {/* フォーム要素 */}
  </form>
);
```

`handleSubmit` 関数を使用して、フォームの送信処理を実装しています。この関数はバリデーションが成功した場合にのみ `onSubmit` コールバックを実行し、成功時にはフォームをリセットしてホームページに遷移します。

---

### 4-2. Task 2-2. zod によるスキーマバリデーション

#### バリデーションスキーマの定義

```typescript
// src/components/equipment/EquipmentForm.tsx から抜粋
const equipmentFormSchema = z.object({
  name: z.string().min(1, { message: "備品名は必須です" }),
  category: z.enum(
    [
      "電子機器",
      "オフィス家具",
      "工具・作業用品",
      "AV機器・周辺機器",
      "消耗品",
      "防災・安全用品",
      "レンタル備品",
      "社用車関連品"
    ] as const,
    {
      errorMap: () => ({ message: "有効なカテゴリを選択してください" })
    }
  ),
  status: z.enum(["使用中", "貸出中", "利用可能", "廃棄"] as const, {
    errorMap: () => ({ message: "有効なステータスを選択してください" })
  }),
  quantity: z.number().min(1, { message: "最低1つ以上必要です" }),
  storageLocation: z.string().min(1, { message: "保管場所は必須です" }),
  purchaseDate: z.string().min(1, { message: "購入日は必須です" }),
  borrower: z.string().optional(),
  notes: z.string().optional()
});

// フォームのデータ型定義（Zodスキーマから型を生成）
type EquipmentFormData = z.infer<typeof equipmentFormSchema>;
```

`zod`を使用して、フォーム入力値のバリデーションスキーマを定義しています。各フィールドには適切な制約と、日本語のエラーメッセージが設定されています。enum フィールドには `errorMap` を使用してカスタムエラーメッセージを提供しています。

#### zodResolver によるバリデーションの統合

```typescript
// src/components/equipment/EquipmentForm.tsx から抜粋
import { zodResolver } from "@hookform/resolvers/zod";

const {
  register
  // ...
} = useForm<EquipmentFormData>({
  resolver: zodResolver(equipmentFormSchema) // Zodスキーマをバリデーション用に接続
  // ...
});
```

`@hookform/resolvers/zod` パッケージの `zodResolver` を使用して、zod のバリデーションスキーマを react-hook-form と統合しています。

---

### 4-3. Task 2-3. エラーメッセージの表示

#### フィールドごとのエラーメッセージ表示

```tsx
// src/components/equipment/EquipmentForm.tsx から抜粋
<div className="space-y-1">
  <label htmlFor="name" className="block text-base font-medium text-gray-700">
    備品名<span className="ml-1 text-red-500">*</span>
  </label>
  <input
    id="name"
    type="text"
    placeholder="例: MacBookノートパソコン"
    {...register("name")}
    aria-invalid={errors.name ? "true" : "false"}
    className={`block my-2 p-2 h-10 w-full rounded-md shadow-sm
    focus:ring focus:ring-gray-200 focus:ring-opacity-50
    transition duration-200 ${
      errors.name
        ? "border-red-300 focus:border-red-500"
        : "border-gray-300 focus:border-gray-500"
    }`}
  />
  {errors.name && (
    <p className="text-base text-red-600 flex items-center" id="name-error">
      {errors.name.message}
    </p>
  )}
</div>
```

各フォームフィールドでは、`errors` オブジェクトを確認し、エラーがある場合にのみエラーメッセージを表示しています。エラー状態に応じて入力フィールドの border 色を変更し、アクセシビリティのために `aria-invalid` 属性も設定しています。

---

### 4-4. Task 2-4. 初期値の設定とフォームのリセット

#### デフォルト値の設定

```typescript
// src/components/equipment/EquipmentForm.tsx から抜粋
const {
  // ...
} = useForm<EquipmentFormData>({
  // ...
  defaultValues: {
    category: "AV機器・周辺機器",
    status: "利用可能",
    quantity: 1,
    purchaseDate: new Date().toISOString().split("T")[0]
  }
});
```

`defaultValues` オプションを使用して、フォームフィールドの初期値を設定しています。

#### フォームのリセット機能

```tsx
// src/components/equipment/EquipmentForm.tsx から抜粋
{
  /* クリアボタン */
}
<button
  type="button"
  onClick={() => reset()}
  className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md
  text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400
  transition duration-200"
>
  クリア
</button>;
```

`reset` 関数を使用して、クリアボタンを実装しています。この関数を呼び出すことで、フォームの入力値を初期値にリセットできます。

---

### 4-5. Task 2-5. フォームのバリデーションタイミングの違い

`react-hook-form` では以下の異なるバリデーションモードをサポートしています：

| バリデーションモード | 特徴                                                 | メリット                                                                                           | デメリット                                                         | 適している場面                                                           |
| -------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `onChange`           | フィールドの値が変更されるたびに実行                 | リアルタイムでフィードバックを提供し、即座にエラーを確認できる                                     | 頻繁なバリデーション実行によりパフォーマンスに影響する可能性がある | 即時フィードバックが重要な短いフォームや単純なバリデーションルール       |
| `onBlur`             | フィールドからフォーカスが外れたときに実行           | 入力完了時にバリデーションを実行するため、中途半端な入力でエラーを表示せず、かつ送信前に確認できる | ユーザーが次のフィールドに移動するまでエラーが表示されない         | バランスの取れたユーザー体験を提供する一般的なフォーム                   |
| `onSubmit`           | フォーム送信時にのみ実行                             | パフォーマンスが最も良く、ユーザーはフォーム完成までエラーに邪魔されない                           | エラーがあることを送信時まで知ることができず、修正に戻る必要がある | パフォーマンスが重要な長いフォームやウィザード形式のフォーム             |
| `onTouched`          | フィールド操作後、値が変更されるたびに実行           | 初期表示時にエラーを表示せず、ユーザーの操作後にのみフィードバック提供                             | `onChange`と同様に頻繁なバリデーションが実行される                 | 初期状態ではエラーを表示せず、操作開始後にフィードバックを提供したい場合 |
| `all`                | すべてのイベント（onChange, onBlur, onSubmit）で実行 | 最も包括的なバリデーションを提供                                                                   | パフォーマンスへの影響が最も大きい                                 | 高度なフィードバックが必要な重要なフォーム（金融取引、法的文書など）     |

本プロジェクトでは、`onBlur` モードを採用しています。

---

## 5. Task 3. ページ遷移（ルーティング）の実装方法の習得

このプロジェクトでは、以下のライブラリを使用してページ遷移とルーティングを実装しました：

- [**react-router-dom**](https://reactrouter.com/en/main): React アプリケーションのルーティングとナビゲーションを管理するためのライブラリ

以下は、各検証項目ごとの実装内容です。

### 5-1. Task 3-1. 基本的なルート定義と`<Route>`コンポーネントの使用方法

#### ルート定義と階層構造

```tsx
// src/App.tsx から抜粋
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Index route - redirects to home */}
          <Route index element={<Navigate to="/home" replace />} />

          {/* Main routes */}
          <Route path="home" element={<HomePage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Dynamic routes*/}
          <Route path="detail/:id" element={<DetailPage />} />
          <Route path="edit/:id" element={<EditPage />} />

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}
```

`<BrowserRouter>` コンポーネントを使用してルーティングのコンテキストを提供し、`<Routes>` と `<Route>` コンポーネントを使用して URL パスと対応するコンポーネントをマッピングしています。この例では、ルート定義を階層的に構成し、親ルート（`<Layout />`）の中に子ルートをネストさせています。

---

### 5-2. Task 3-2. 動的ルートパラメータとクエリパラメータの取得方法

#### 動的ルートパラメータの取得

```tsx
// src/pages/DetailPage.tsx から抜粋
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import { useEquipmentById } from "../hooks/useEquipment";
import useEquipmentStore from "../stores/equipmentStore";

const DetailPage = () => {
  // URL から id パラメータを取得
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // グローバル状態へのアクセス
  const { selectEquipment, addToRecentlyViewed } = useEquipmentStore();

  // id を使って特定の備品データを取得
  const { data, isLoading, isError, error } = useEquipmentById(id || "");

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

  // ローディング、エラー、データ表示処理...
};
```

`useParams` フックを使用して、URL から動的パラメータ（`:id`）を取得しています。この例では、備品の詳細ページで特定の備品 ID を URL から取得し、その ID を使ってデータを取得しています。さらに、取得したデータをグローバルステート（Zustand）に保存し、最近閲覧した備品リストにも追加しています。

#### クエリパラメータの取得

```tsx
// src/pages/Homepage.tsx から抜粋
import { useNavigate, useSearchParams } from "react-router-dom";
import useFilterStore from "../stores/filterStore";

const HomePage = () => {
  // ナビゲーションとURLクエリパラメータ管理のためのReact Routerフック
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // グローバルステートからフィルター状態を取得
  const {
    categoryFilter,
    statusFilter,
    searchQuery,
    setCategoryFilter,
    setStatusFilter,
    setSearchQuery,
    clearFilters,
    setFiltersFromUrl
  } = useFilterStore();

  // URLクエリパラメータの解析をメモ化
  const urlParams = useMemo(() => {
    const categoryFromUrl = searchParams.get("category");
    const statusFromUrl = searchParams.get("status");
    const searchFromUrl = searchParams.get("search") || "";

    return {
      category: (categoryFromUrl || "") as EquipmentCategory | "",
      status: (statusFromUrl || "") as EquipmentStatus | "",
      search: searchFromUrl
    };
  }, [searchParams]);

  // URLパラメータ更新関数
  const updateSearchParams = useCallback(
    (key: string, value: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  // URL同期エフェクト
  useEffect(() => {
    if (
      urlParams.category !== categoryFilter ||
      urlParams.status !== statusFilter ||
      urlParams.search !== searchQuery
    ) {
      setFiltersFromUrl(urlParams.category, urlParams.status);
      if (urlParams.search !== searchQuery) {
        setSearchQuery(urlParams.search);
        setLocalSearchQuery(urlParams.search);
      }
    }
  }, [
    urlParams,
    categoryFilter,
    statusFilter,
    searchQuery,
    setFiltersFromUrl,
    setSearchQuery
  ]);

  // ...ホームページのレンダリングロジック
};
```

`useSearchParams` フックを使用して、URL からクエリパラメータを取得・設定しています。この例では、備品リストをカテゴリ、ステータス、検索キーワードでフィルタリングするために、クエリパラメータを活用しています。また、URL パラメータとグローバルステート（Zustand）を同期させ、画面遷移や更新後もフィルタ状態が保持されるようになっています。さらにキーワード検索にはデバウンス処理が実装されています。

---

### 5-3. Task 3-3. ネストされたルーティングとレイアウト構成

#### 共通レイアウトの実装

```tsx
// src/components/common/Layout.tsx から抜粋
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6 flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          &copy; {new Date().getFullYear()} 備品管理システム
        </div>
      </footer>
    </div>
  );
};

export default Layout;
```

ネストされたルーティングを活用して、共通のレイアウト（ヘッダー、フッターなど）を持つページ構造を実装しています。`<Layout>` コンポーネントは、すべてのページに共通するナビゲーションバーとフッターを含み、中央のコンテンツ領域は `<Outlet>` を使って子ルートのコンポーネントを表示しています。

---

### 5-4. Task 3-4. `<Outlet>`コンポーネントの使用

```tsx
// src/components/common/Layout.tsx から抜粋
<main className="container mx-auto px-4 py-6 flex-grow">
  <Outlet />
</main>
```

`<Outlet>` コンポーネントは、親ルートの中で子ルートのコンポーネントを表示するためのプレースホルダーとして機能します。これにより、レイアウトを再利用しながら、内部コンテンツだけを変更することができます。

---

### 5-5. Task 3-5. ナビゲーション（useNavigate, `<Link>`）の実装

#### 宣言的なナビゲーション（`<Link>`）

```tsx
// src/components/common/Navbar.tsx から抜粋
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const currentPage = useLocation();

  const knownRoutes = ["/", "/home", "/register", "/detail", "/edit"];

  const isKnownRoute = knownRoutes.some(
    (route) =>
      currentPage.pathname === route ||
      (route !== "/" && currentPage.pathname.startsWith(route + "/"))
  );

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            備品管理システム
          </Link>
          <div className="space-x-4">
            {isKnownRoute && (
              <Link
                to="/register"
                className="px-4 py-2 text-sm text-gray-900 bg-slate-400
              hover:bg-slate-600 hover:text-white rounded-md transition-colors"
              >
                新規登録
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

`<Link>` コンポーネントを使用して、宣言的なナビゲーションを実装しています。このコンポーネントは、内部的には `history.pushState()` API を使用してページを再読み込みせずに URL を変更します。

#### プログラムによるナビゲーション（useNavigate）

```tsx
// src/components/equipment/EquipmentForm.tsx から抜粋
import { useNavigate } from "react-router-dom";

const EquipmentForm = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateEquipment();

  const onSubmit = (data: EquipmentFormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        navigate("/"); // ホームページにリダイレクト
      }
    });
  };

  // ...フォームのレンダリングロジック
};
```

`useNavigate` フックを使用して、プログラムによるナビゲーションを実装しています。この例では、フォーム送信が成功した後に、ユーザーをホームページにリダイレクトしています。

---

## 6. Task 4. グローバルステート管理の実装方法の習得

このプロジェクトでは、以下のライブラリを使用してグローバルステート管理を実装しました：

- [**zustand**](https://github.com/pmndrs/zustand): シンプルで軽量なグローバルステート管理ライブラリ
- [**zustand/middleware**](https://github.com/pmndrs/zustand#middleware): devtools デバッグ統合のためのミドルウェア

### 6-1. グローバルステート管理とは

React アプリでは、ユーザー情報やフィルター状態、テーマ（ダーク／ライト）など、複数のコンポーネントで共有したいデータを「グローバルステート」として管理することがあります。これを効率的に扱うための仕組みが「グローバルステート管理」です。

### 6-2. Redux と Zustand の違い

Redux は昔からあるグローバルステート管理ライブラリで、大規模アプリでも対応できるように設計されています。しかし、使うには「アクション」「リデューサー」「ストア」などの知識が必要で、初心者にとっては少しハードルが高めです。また、コードが冗長になりがちです。

一方、Zustand はとてもシンプルで直感的な書き方ができる軽量なライブラリです。React のフック（useStore）だけで状態の読み取りと更新ができ、学習コストが低く、導入も簡単です。

> Zustand という名前はドイツ語で「状態」を意味します。発音については、ドイツ語風に「ツーシュタント」と読まれることもあれば、英語圏では「ズースタンド」と呼ばれることが多いです。
>
> 参照：[【初心者向け】Zustand で React の状態管理を簡単に！使い方を徹底解説！](https://envader.plus/article/524)

以下は、各検証項目ごとの実装内容です。

### 6-3. Task 4-1. ストアの定義と利用（create, useStore）

#### 基本的なストア作成

```typescript
// src/stores/filterStore.ts から抜粋
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EquipmentCategory, EquipmentStatus } from "../types/equipment";

type FilterState = {
  // State
  categoryFilter: EquipmentCategory | "";
  statusFilter: EquipmentStatus | "";
  searchQuery: string; // 検索クエリ状態

  // Actions
  setCategoryFilter: (category: EquipmentCategory | "") => void;
  setStatusFilter: (status: EquipmentStatus | "") => void;
  setSearchQuery: (query: string) => void; // 検索クエリ更新アクション
  setFiltersFromUrl: (
    category: EquipmentCategory | "",
    status: EquipmentStatus | "",
    search?: string // URL検索パラメータ同期用
  ) => void;
  clearFilters: () => void;
};

// ストアを定義
const useFilterStore = create<FilterState>()(
  devtools(
    (set) => ({
      // Initial State
      categoryFilter: "",
      statusFilter: "",
      searchQuery: "", // 検索クエリの初期値

      // Actions
      setCategoryFilter: (category) =>
        set({ categoryFilter: category }, false, "setCategoryFilter")
      // ...他のアクション
    }),
    { name: "Filter Store" }
  )
);

export default useFilterStore;
```

`create` 関数を使用して、グローバルステートのストアを作成しています。ストアの定義には、初期状態（state）とその状態を更新するためのアクション（actions）を含めています。上記では、フィルター機能用に `categoryFilter` と `statusFilter` に加えて、`searchQuery` を実装し、フィルタ状態の管理を完結にしています。第三引数にアクション名を指定することでデバッグをしやすくしています。

#### コンポーネントでのストア利用

```tsx
// src/pages/Homepage.tsx から抜粋
import { useNavigate, useSearchParams } from "react-router-dom";
import useFilterStore from "../stores/filterStore";

const HomePage = () => {
  // React Router によるURLパラメータ管理
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // グローバルステートからフィルター状態を取得
  const {
    categoryFilter,
    statusFilter,
    searchQuery,
    setCategoryFilter,
    setStatusFilter,
    setSearchQuery,
    clearFilters,
    setFiltersFromUrl
  } = useFilterStore();

  // URLクエリパラメータの解析をメモ化
  const urlParams = useMemo(() => {
    const categoryFromUrl = searchParams.get("category");
    const statusFromUrl = searchParams.get("status");
    const searchFromUrl = searchParams.get("search") || "";

    return {
      category: (categoryFromUrl || "") as EquipmentCategory | "",
      status: (statusFromUrl || "") as EquipmentStatus | "",
      search: searchFromUrl
    };
  }, [searchParams]);

  // URL同期エフェクト - URLとグローバルステートを同期
  useEffect(() => {
    if (
      urlParams.category !== categoryFilter ||
      urlParams.status !== statusFilter ||
      urlParams.search !== searchQuery
    ) {
      setFiltersFromUrl(urlParams.category, urlParams.status);
      if (urlParams.search !== searchQuery) {
        setSearchQuery(urlParams.search);
        setLocalSearchQuery(urlParams.search);
      }
    }
  }, [
    urlParams,
    categoryFilter,
    statusFilter,
    searchQuery,
    setFiltersFromUrl,
    setSearchQuery
  ]);
};
```

コンポーネント内で `useFilterStore` フックを使用して、グローバルステートとその更新関数にアクセスしています。これにより、プロップドリリング（props の深い階層への受け渡し）を避けながら、複数のコンポーネント間でステートを共有できます。さらに、URL パラメータとグローバルステートを同期させることで、ページが更新されても状態が保持されるようになっています。

---

### 6-4. Task 4-2. ステートの読み取りと更新

#### 単純なステート更新

```typescript
// src/stores/filterStore.ts から抜粋
setCategoryFilter: (category) =>
  set({ categoryFilter: category }, false, "setCategoryFilter"),

setStatusFilter: (status) =>
  set({ statusFilter: status }, false, "setStatusFilter"),

setSearchQuery: (query) =>
  set({ searchQuery: query }, false, "setSearchQuery"),

setFiltersFromUrl: (category, status, search = "") =>
  set(
    {
      categoryFilter: category,
      statusFilter: status,
      searchQuery: search
    },
    false,
    "setFiltersFromUrl"
  ),

clearFilters: () =>
  set(
    {
      categoryFilter: "",
      statusFilter: "",
      searchQuery: "" // 検索クエリもクリア
    },
    false,
    "clearFilters"
  )
```

`set` 関数を使用して、ストアの状態を更新しています。引数として新しい状態のオブジェクトを渡すことで、既存の状態と自動的にマージされます。第三引数にアクション名を指定することで、Redux DevTools での識別が容易になります。`setFiltersFromUrl` アクションは URL からの複数のパラメータを一度に同期するために使用されています。

#### コンポーネントでのステート読み取り

```typescript
// src/components/equipment/EquipmentList.tsx から抜粋
import useFilterStore from "../../stores/filterStore";

const EquipmentList = () => {
  // グローバルストアからフィルターを取得（検索クエリも含む）
  const { categoryFilter, statusFilter, searchQuery } = useFilterStore();

  // フィルタリングと検索されたデータをメモ化
  const filteredAndSearchedData = useMemo(() => {
    if (!data) return [];

    let result = data;

    // カテゴリとステータスフィルター
    result = result.filter((item) => {
      const matchesCategory =
        !categoryFilter || item.category === categoryFilter;
      const matchesStatus = !statusFilter || item.status === statusFilter;
      return matchesCategory && matchesStatus;
    });

    // 検索クエリフィルター
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        return (
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query) ||
          item.storageLocation.toLowerCase().includes(query) ||
          (item.borrower && item.borrower.toLowerCase().includes(query)) ||
          (item.notes && item.notes.toLowerCase().includes(query))
        );
      });
    }

    return result;
  }, [data, categoryFilter, statusFilter, searchQuery]);

  // ...リストのレンダリングロジック
};
```

コンポーネント内で、ストアから取得したステート（カテゴリ、ステータスフィルター、検索クエリ）を使って、表示データのフィルタリングを行っています。また、パフォーマンス最適化のために `useMemo` フックを使用して、依存値（フィルターや検索クエリ）が変更された場合のみ再計算を行っています。ステートが更新されると、自動的にコンポーネントが再レンダリングされ、フィルタリングされた結果が表示されます。

#### 前の状態を参照する複雑な更新

```typescript
// src/stores/equipmentStore.ts から抜粋
addToRecentlyViewed: (equipmentId) =>
  set(
    (state) => {
      const newRecentlyViewed = [
        equipmentId,
        ...state.recentlyViewed.filter((id) => id !== equipmentId)
      ].slice(0, 5);

      return { recentlyViewed: newRecentlyViewed };
    },
    false,
    "addToRecentlyViewed"
  ),
```

前の状態に基づいて更新を行うために、`set` 関数にコールバック関数を渡しています。この例では、最近表示した備品の ID リストを管理し、新しい ID を追加する際に、重複を除去して最大 5 つまでに制限しています。このパターンは、現在の状態に基づいて計算が必要な場合に特に有用です。

`DetailPage`コンポーネント内では、ページが読み込まれるたびに`addToRecentlyViewed`アクションが呼び出され、閲覧履歴が更新されます。

---

### 6-5. Task 4-3. ストアの分割とモジュール化

本プロジェクトでは、機能ごとに複数のストアを作成し、責任を分離しています。この方法により、各ストアは特定の機能領域に集中でき、コードの可読性と保守性が向上します。

#### 機能ごとのストア分割

1. **`filterStore.ts`** - 備品リストのフィルタリング機能を担当

```typescript
// src/stores/filterStore.ts
type FilterState = {
  // State
  categoryFilter: EquipmentCategory | "";
  statusFilter: EquipmentStatus | "";
  searchQuery: string;

  // Actions
  setCategoryFilter: (category: EquipmentCategory | "") => void;
  setStatusFilter: (status: EquipmentStatus | "") => void;
  setSearchQuery: (query: string) => void;
  setFiltersFromUrl: (
    category: EquipmentCategory | "",
    status: EquipmentStatus | "",
    search?: string
  ) => void;
  clearFilters: () => void;
};

const useFilterStore = create<FilterState>()(
  devtools(
    (set) => ({
      // Initial State & Actions...
    }),
    { name: "Filter Store" }
  )
);
```

2. **`equipmentStore.ts`** - 選択された備品と閲覧履歴の管理を担当

```typescript
// src/stores/equipmentStore.ts
type EquipmentState = {
  // State
  selectedEquipment: Equipment | null;
  recentlyViewed: string[];

  // Actions
  selectEquipment: (equipment: Equipment | null) => void;
  addToRecentlyViewed: (equipmentId: string) => void;
  clearRecentlyViewed: () => void;
};

const useEquipmentStore = create<EquipmentState>()(
  devtools(
    (set) => ({
      // Initial State & Actions...
    }),
    { name: "Equipment Store" }
  )
);
```

---

### 6-6. Task 4-4. React DevTools との連携とデバッグ

#### devtools ミドルウェアの統合

```typescript
// src/stores/filterStore.ts から抜粋
import { devtools } from "zustand/middleware";

const useFilterStore = create<FilterState>()(
  devtools(
    (set) => ({
      // ストアの内容
    }),
    { name: "Filter Store" } // DevTools でのストア名
  )
);
```

`devtools` ミドルウェアを使用して、Redux DevTools エクステンションとの統合を実装しています。これにより、ブラウザの開発者ツールでステート変更の履歴を追跡し、デバッグできます。ミドルウェアに `name` オプションを渡すことで、Redux DevTools で識別しやすくなります。

#### アクション名のラベル付け

```typescript
// src/stores/equipmentStore.ts から抜粋
setSearchQuery: (query) =>
  set({ searchQuery: query }, false, "setSearchQuery"),

// 複合アクション
setFiltersFromUrl: (category, status, search = "") =>
  set(
    {
      categoryFilter: category,
      statusFilter: status,
      searchQuery: search
    },
    false,
    "setFiltersFromUrl"
  ),

// 前の状態を参照する複雑なアクション
addToRecentlyViewed: (equipmentId) =>
  set(
    (state) => ({
      // 状態計算ロジック
    }),
    false,
    "addToRecentlyViewed"
  ),
```

`set` 関数の第三引数にアクション名を指定することで、DevTools でのアクションの追跡が容易になります。

#### デバッグの利用方法

1. ブラウザに [Redux DevTools 拡張機能](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) をインストールします
2. アプリケーションを開発モードで実行します
3. ブラウザの開発者ツールで Redux タブを開きます
4. ドロップダウンメニューから目的のストア（"Filter Store" または "Equipment Store"）を選択します
5. アプリケーションの操作時に発生するステート変更を監視できます
   - フィルターの変更
   - 検索クエリの入力
   - 備品詳細ページの閲覧（最近閲覧リストの更新）
6. タイムトラベル機能を使用して、過去の状態に戻ることもできます
7. アクションを選択して「Action」と「State」タブで詳細を確認できます

---

## 7. Task 5. テストの実行と検証方法の習得

このプロジェクトでは、以下のライブラリを使用してユニットテストとコンポーネントテストを実装しました：

- [**Vitest**](https://vitest.dev/): Vite ベースの高速テストフレームワーク
- [**React Testing Library**](https://testing-library.com/docs/react-testing-library/intro/): ユーザー視点でのテストを作成するための API
- [**@testing-library/user-event**](https://testing-library.com/docs/user-event/intro/): ユーザーのインタラクションをシミュレートするツール

> しかし、本プロジェクトは **コンポーネントベースアーキテクチャ（CBA）** に基づいて開発されています。ドメイン駆動設計（DDD）は採用していないため、テストもビジネスドメインロジックではなく **UI コンポーネントの振る舞い** に重点を置いています。テストケースではユーザーからの視点でインターフェースの機能を検証し、内部実装の詳細よりもユーザー体験の正確さを優先しています。

> したがって、`domain-testing` ブランチでは、比較検討のためにドメイン駆動設計のアプローチを取り入れたテスト実装を行っています。このブランチでは、ビジネスロジックを UI から分離し、ドメインモデルとユースケースに焦点を当てたテストを実装しています。通常のテストがコンポーネント中心であるのに対し、`domain-testing` ブランチでは、ドメインロジックの単体テストを優先しつつ、UI コンポーネントとの統合テストも提供しています。両アプローチの違いを理解するために、このブランチのREADMEファイルに参考してください。

以下は、各検証項目ごとの実装内容です。

### 7-1. テストのセットアップ方法

プロジェクトでは、Vitest と React Testing Library を使用してテストを実施するための環境が整えられています。これらのテストフレームワークは、高速かつ効率的にフロントエンドアプリケーションをテストできるように設計されています。

#### src/tests/setup.ts について

`src/tests/setup.ts` ファイルはテスト環境の基本設定を行うファイルで、すべてのテスト実行前に自動的に読み込まれます：

```tsx
// src/tests/setup.ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
```

このファイルは以下の重要な役割を果たします：

1. **React Testing Library の拡張機能の読み込み**：

   - `@testing-library/jest-dom/vitest`をインポートすることで、`toBeInTheDocument()`や`toHaveTextContent()`などの便利なマッチャーをテストで使用できるようになります。
   - これらのマッチャーは、DOM 要素の存在や内容を検証する際に非常に直感的な API を提供します。

2. **テスト後のクリーンアップ**：
   - 各テストの実行後に`cleanup()`を実行することで、テスト間で DOM がリセットされ、テスト間の干渉を防ぎます。
   - これにより、各テストが独立して実行され、前のテストの状態に影響されないことが保証されます。

#### vitest.config.ts について

Vitest の設定ファイル（`vitest.config.ts`）はテスト環境の詳細な設定を行います：

```tsx
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom", // テスト実行環境としてhappy-domを使用
    globals: true, // グローバル関数（describe, it, expect）を自動インポート
    setupFiles: "src/tests/setup.ts", // セットアップファイルのパス
    coverage: {
      reporter: ["text", "json", "html"] // カバレッジレポートの形式
    }
  }
});
```

各設定の詳細説明：

1. **`environment: "happy-dom"`**：

   - ブラウザ環境をシミュレートするための JSDOM 代替として軽量な happy-dom を使用します。
   - happy-dom は JSDOM より高速で、メモリ効率が良く、Vitest との相性も優れています。
   - これにより、DOM を操作するテストが Node.js 環境でも高速に実行できます。

2. **`globals: true`**：

   - `describe`、`it`、`expect`などのテスト関数をファイル内で明示的にインポートせずに使えるようにします。
   - これにより、テストコードがよりクリーンになり、可読性が向上します。

3. **`setupFiles: "src/tests/setup.ts"`**：

   - 上記のセットアップファイルをすべてのテスト実行前に読み込みます。
   - 共通の設定や準備作業をすべてのテスト間で共有するために使用します。

4. **`coverage`**：
   - テストカバレッジを出力する形式を指定しています。
   - `text`：コンソールにテキスト形式で表示（即時確認に便利）
   - `json`：JSON 形式でファイル出力（CI/CD システムやその他のツールとの連携に便利）
   - `html`：HTML レポートを生成（視覚的に確認しやすい形式で、カバレッジの詳細な分析に最適）

### 7-2. 便利な拡張機能とショートカット

#### VS Code 拡張機能

| 拡張機能名                   | 説明                                 |
| ---------------------------- | ------------------------------------ |
| **Vitest** (公式)            | テスト実行とデバッグのための統合機能 |
| **Vitest Snippets**          | Vitest の便利なコードスニペット      |
| **Testing Library Snippets** | React Testing Library のスニペット集 |

#### よく使うスニペットショートカット

| ショートカット | 展開されるコード                                          | 用途                             |
| -------------- | --------------------------------------------------------- | -------------------------------- |
| `desc→`        | `describe('name', () => { ... })`                         | テストグループを定義             |
| `test→`        | `test('should ...', () => { ... })`                       | テストケースを定義               |
| `itr→`         | `import { render, screen } from '@testing-library/react'` | Testing Library の基本インポート |
| `itrh→`        | `import { renderHook } from '@testing-library/react'`     | フックテスト用インポート         |
| `itue→`        | `import userEvent from '@testing-library/user-event'`     | ユーザーイベント用インポート     |
| `ait→`         | `await waitFor(() => { expect(...) })`                    | 非同期テスト用ヘルパー           |

詳細は[Testing Library Snippets のチートシート](https://marketplace.visualstudio.com/items?itemName=deinsoftware.testing-library-snippets#cheat-sheet)を参照してください。

#### 便利なマッチャー一覧

| マッチャー            | 説明                         | 使用例                                          |
| --------------------- | ---------------------------- | ----------------------------------------------- |
| `toBeInTheDocument()` | 要素が DOM に存在するか確認  | `expect(element).toBeInTheDocument()`           |
| `toHaveTextContent()` | テキスト内容を確認           | `expect(element).toHaveTextContent('テキスト')` |
| `toBeDisabled()`      | 要素が無効化されているか確認 | `expect(button).toBeDisabled()`                 |
| `toHaveValue()`       | フォーム要素の値を確認       | `expect(input).toHaveValue('テキスト')`         |
| `toHaveAttribute()`   | HTML 属性を確認              | `expect(link).toHaveAttribute('href', '/home')` |
| `toBeVisible()`       | 要素が表示されているか確認   | `expect(element).toBeVisible()`                 |
| `toBeChecked()`       | チェックボックスの状態を確認 | `expect(checkbox).toBeChecked()`                |

詳細は[React Testing Library のチートシート](https://testing-library.com/docs/react-testing-library/cheatsheet/)を参照してください。

### 7-3. テストするポイント

1. **実装ではなく振る舞いをテスト**: 内部実装の詳細ではなく、ユーザーから見える振る舞いをテストします。
2. **アクセシビリティを考慮**: スクリーンリーダーなどの支援技術が使用する属性（ラベル、ロール）に基づいて要素を検索します。
3. **最小限のモック**: 可能な限り実際のコンポーネントを使用し、必要な場合のみモックを使用します。
4. **ユーザー視点のクエリ**: `getByRole`, `getByLabelText`, `getByText` などの「ユーザー視点」のクエリを優先的に使用します。
5. **スナップショットの適切な利用**: スナップショットは選択的に使用し、意図的な UI 変更を反映するために定期的に更新します。

### 7-4. テストの実行方法

- プロジェクトのテストは、以下のコマンドを実行：

```bash
npm run test
```

- 特定のテストファイルのみを実行する場合は：

```bash
npm run test filename.test.tsx
```

- テストカバレッジレポートを生成する場合は：

```bash
npm run coverage
```

- テストカバレッジレポートを生成する場合は：

```bash
npm run test:ui
```

- スナップショットを更新する場合は（UI の意図的な変更後）：

```bash
npm run test -- -u
```

- 特定のテストファイルのスナップショットのみを更新する場合：

```bash
npm run test filename.test.tsx -- -u
```

---

### 7-5. Task 5-1. コンポーネントのユニットテストとスナップショットテスト

コンポーネントテストでは、コンポーネントが**正しくレンダリングされ、期待通りに動作する**ことを検証します。

#### 基本的なコンポーネントテスト

```tsx
// src/tests/components/common/Navbar.test.tsx から抜粋
import { render, screen } from "@testing-library/react";
import { describe, test as it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";

// BrowserRouterでラップするヘルパー関数
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe("Navbarコンポーネント", () => {
  it("アプリタイトルが表示されることを確認", () => {
    renderWithRouter(<Navbar />);

    expect(screen.getByText("備品管理システム")).toBeInTheDocument();
  });

  it("ナビゲーションリンクが正しく表示されることを確認", () => {
    renderWithRouter(<Navbar />);

    expect(screen.getByText("新規登録")).toBeInTheDocument();
  });
});
```

このテストでは、以下の基本的な手順に従っています：

1. **コンポーネントのレンダリング**: `render` 関数を使用して、テスト対象のコンポーネントをレンダリングします。
2. **要素の検証**: `screen.getByText()` などの「クエリ」を使用して、特定のテキストや要素がドキュメントに存在することを確認します。
3. **アサーション**: `expect()` と `toBeInTheDocument()` などのマッチャーを使用して、期待される結果と実際の結果を比較します。

ルーター依存のコンポーネントをテストするために、`renderWithRouter` ヘルパー関数を使用して、`BrowserRouter` コンテキストでコンポーネントをラップしています。

#### スナップショットテスト

```tsx
// src/tests/components/common/Navbar.test.tsx から抜粋
it("スナップショットと一致することを確認", () => {
  const { asFragment } = renderWithRouter(<Navbar />);

  // コンポーネントのレンダリングが一貫していることを確認
  expect(asFragment()).toMatchSnapshot();
});
```

スナップショットテストは、コンポーネントのレンダリング出力を「スナップショット」として保存し、将来のテスト実行時に変更がないかを検証します。
これにより、意図しない UI の変更を検出できます。

初回実行時には、レンダリング結果が `__snapshots__` ディレクトリに保存されます。
その後のテスト実行では、現在のレンダリング結果と保存されたスナップショットを比較します。

### 例（Navbar.test.tsx.snap）

```tsx
// src/tests/components/common/__snapshots__/Navbar.test.tsx.snap から抜粋
// Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports[`Navbarコンポーネント > スナップショットと一致することを確認 1`] = `
<DocumentFragment>
  <nav
    class="bg-gray-800 text-white shadow-md"
  >
    <div
      class="container mx-auto px-4 py-3"
    >
      <div
        class="flex justify-between items-center"
      >
        <a
          class="text-xl font-bold"
          data-discover="true"
          href="/"
        >
          備品管理システム
        </a>
        <div
          class="space-x-4"
        >
          <a
            class="px-4 py-2 text-sm text-gray-900 bg-slate-400
              hover:bg-slate-600 hover:text-white rounded-md transition-colors"
            data-discover="true"
            href="/register"
          >
            新規登録
          </a>
        </div>
      </div>
    </div>
  </nav>
</DocumentFragment>
`;
```

### 7-6. Task 5-2. ユーザーイベント（クリック、入力、送信など）のテスト

ユーザーによるインタラクション（クリック、入力など）をシミュレートして、コンポーネントが正しく応答することを検証します。

#### クリックイベントのテスト

```tsx
// src/tests/components/common/Navbar.test.tsx から抜粋
import userEvent from "@testing-library/user-event";

it("ナビゲーションリンクをクリックすると正しいパスに遷移することを確認", async () => {
  renderWithRouter(<Navbar />);
  const user = userEvent.setup();

  // 正規表現を使用して大文字小文字を区別せずに検索。
  // テキストの一部が変わっても検出できるため柔軟性が高い
  const registerLink = screen.getByText(/新規登録/);
  await user.click(registerLink);

  // リンクのhref属性を確認
  expect(registerLink.closest("a")).toHaveAttribute("href", "/register");
});
```

この例では、以下の手順でユーザーインタラクションをテストしています：

1. **ユーザーイベントのセットアップ**: `userEvent.setup()` を使用して、ユーザーイベントをシミュレートするための環境を準備します。
2. **要素の取得**: `screen.getByText()` を使用して、クリック対象の要素を取得します。
3. **イベントのシミュレーション**: `user.click()` を使用して、ユーザーがリンクをクリックする動作をシミュレートします。
4. **結果の検証**: クリック後の状態や振る舞いを検証します。この例では、リンクの `href` 属性が期待値と一致することを確認しています。

`userEvent` ライブラリは、実際のユーザーの行動に近い形でイベントをシミュレートします。

### 7-7. Task 5-3. フォームの入力とバリデーションエラーのテスト

フォームコンポーネントのテストでは、ユーザーによる入力操作とバリデーションの動作を検証します。

```tsx
// src/tests/components/equipment/EquipmentForm.test.tsx から抜粋
it("必須フィールドが空の場合にバリデーションエラーが表示されることを確認", async () => {
  // 準備
  const user = userEvent.setup();
  renderWithRouter(<EquipmentForm />);
  const submitButton = screen.getByRole("button", { name: /登録/ });

  // 実行 - すべてのフィールドをクリアして送信
  const nameInput = screen.getByLabelText(/備品名/);
  await user.clear(nameInput);

  const categorySelect = screen.getByLabelText(/カテゴリ/);
  await user.selectOptions(categorySelect, "");

  const locationInput = screen.getByLabelText(/保管場所/);
  await user.clear(locationInput);

  const purchaseDateInput = screen.getByLabelText(/購入日/);
  await user.clear(purchaseDateInput);

  await user.click(submitButton);

  // 検証 - エラーメッセージが表示されることを確認
  await waitFor(() => {
    expect(screen.getByText(/備品名は必須です/)).toBeInTheDocument();
    expect(
      screen.getByText(/有効なカテゴリを選択してください/)
    ).toBeInTheDocument();
    expect(screen.getByText(/保管場所は必須です/)).toBeInTheDocument();
  });
});
```

フォームの入力とバリデーションエラーのテストでは、以下の手法を使用しています：

1. **実際のフォーム要素の操作**: `getByLabelText`を使用してアクセシビリティを考慮した要素の取得
2. **ユーザー操作のシミュレーション**: `user.clear`, `user.selectOptions`, `user.type`などを使用
3. **バリデーションの発火**: フォーム送信ボタンのクリックによるバリデーション実行
4. **非同期検証**: `waitFor`を使用してエラーメッセージが表示されるのを待機
5. **フィールド単位のエラー検証**: 特定のバリデーションエラーメッセージが DOM に表示されることを確認

実装例としては、以下のようなテストケースもあります：

```tsx
it("在庫数に無効な値を入力した場合にバリデーションエラーが表示されることを確認", async () => {
  const user = userEvent.setup();
  renderWithRouter(<EquipmentForm />);

  const quantityInput = screen.getByLabelText(/在庫数/);

  // 実行 - 無効な値（0）を入力
  await user.clear(quantityInput);
  await user.type(quantityInput, "0");

  // フォーカスを外してバリデーションを発火
  await user.tab();

  // 検証
  await waitFor(() => {
    expect(screen.getByText("最低1つ以上必要です")).toBeInTheDocument();
  });
});
```

これらのテストは、実際のユーザーの操作に近い形でフォームのバリデーション機能を検証し、アプリケーションの堅牢性 (robustness) を確保します。

### 7-8. Task 5-4. API 呼び出しを含む非同期処理のテスト（waitFor, mock）

API 呼び出しなどの非同期処理をテストする場合は、実際の API を呼び出すのではなく、`mock` 関数を使用します。これにより、テストの実行速度を向上させ、テストの安定性を確保できます。

```tsx
// src/tests/hooks/useEquipment.test.tsx から抜粋
vi.mock("../../api/equipmentApi", () => ({
  fetchEquipments: vi.fn(),
  fetchEquipmentById: vi.fn()
}));

describe("useEquipments", () => {
  it("データ取得に成功した場合、正しいデータが返されることを確認", async () => {
    // APIモックの設定
    const mockData = [
      {
        id: "1",
        name: "テスト備品",
        category: "電子機器",
        status: "利用可能",
        quantity: 1,
        storageLocation: "テスト保管場所",
        purchaseDate: "2023-01-01",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      }
    ];
    fetchEquipments.mockResolvedValue(mockData);

    // フックのレンダリング
    const { result } = renderHook(() => useEquipments(), {
      wrapper: createWrapper()
    });

    // ローディング状態の確認
    expect(result.current.isLoading).toBe(true);

    // データ取得完了を待機
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // 取得データの検証
    expect(result.current.data).toEqual(mockData);
  });
});
```

API 呼び出しを含む非同期処理のテストでは、以下の手法を実装しています：

1. **API レイヤーのモック**: `vi.mock`を使用して API 関数をモック化
2. **モックレスポンスの設定**: 成功ケースと失敗ケースの両方をテスト
3. **非同期フックのテスト**: `renderHook`を使用してカスタムフックをレンダリング
4. **非同期状態の検証**: `waitFor`を使用してデータ取得の完了を待機
5. **状態遷移の確認**: `isLoading`, `isError`, `isSuccess`などの状態フラグを検証
6. **取得データの検証**: モックデータと実際に返されたデータの一致を確認

このテストアプローチにより、外部依存性を持つコンポーネントやフックを、実際の API を呼び出すことなく効率的にテストできます。また、ローディング状態やエラー状態など、さまざまな状況でのアプリケーションの振る舞いを確認できます。
