# 次の習得項目について

次の習得項目について、検証したサンプルアプリケーションを作成してください。
サンプルアプリケーションは、検証項目ごとでも、1 つのアプリケーションでも構いません。
また、README を作成して、検証した内容を記載してください。

## 1. Web API の適切な呼び出しと実装方法の習得

以下のライブラリを使用し、Web API を適切に呼び出し、レスポンスの検証およびキャッシュ処理を含めた実装ができるようになる。

- axios：HTTP クライアントライブラリ
- react-query (TanStack Query)：データ取得、キャッシング、ステート管理ライブラリ
- zod：スキーマバリデーションライブラリ

### 検証内容

- axios を使って API リクエストを送信し、react-query によってデータをキャッシュする方法
- クエリキーの命名規則と設計指針
- キャッシュの有効期限（staleTime / cacheTime）の設定
- キャッシュの無効化、再取得（refetch、invalidateQueries）の方法
- zod による API レスポンスのバリデーション
- スキーマ定義と型の自動生成（z.infer）
- バリデーション処理の実装と失敗時のエラーハンドリング
- カスタムフックとして API 処理を実装する方法
- データ取得（useQuery）
- データの作成、更新、削除（useMutation）
- エラーハンドリングのベストプラクティス（例：トースト通知、フォームフィードバック）
- ローディング、エラー、成功状態の UI 制御方法（isLoading, isError, isSuccess）

## 2. フォームの制御と入力検証の実装方法の習得

以下のライブラリを用いて、フォーム入力の制御およびバリデーションを行う方法を理解し、実装できるようになる。

- react-hook-form：フォーム状態管理ライブラリ
- zod：スキーマバリデーションライブラリ

> react-hook-form が採用した非制御コンポーネントと、React が推奨する制御コンポーネントの違いを理解して、react-hook-form を扱えるようになる。

### 検証内容

- フォーム制御と状態管理（useForm、Controller など）
- zod を使ったフォーム入力値のスキーマバリデーション（zodResolver の活用）
- 入力エラー発生時に、該当フォーム項目の近くにエラーメッセージを表示する方法
- 初期値の設定とフォームのリセット方法
- フォームのバリデーションタイミング（onChange, onBlur, onSubmit）の違い

## 3. ページ遷移（ルーティング）の実装方法の習得

react-router-dom を使用して、SPA におけるページルーティングを実装できるようになる。

### 検証内容

- 基本的なルート定義と`<Route>`コンポーネントの使用方法
- 動的ルートパラメータとクエリパラメータの取得方法
- ネストされたルーティングとレイアウト構成
- `<Outlet>`コンポーネントの使用
- ナビゲーション（useNavigate, `<Link>`）の実装

## 4. グローバルステート管理の実装方法の習得

zustand を使用して、アプリケーションのグローバルステートを管理できるようになる。

### 検証内容

- ストアの定義と利用（create, useStore）
- ステートの読み取りと更新
- ストアの分割とモジュール化
- React DevTools との連携とデバッグ

## 5. テストの実行と検証方法の習得

以下のライブラリを用いて、ユニットテスト、コンポーネントテストを実施できるようになる。

- vitest：軽量で高速なテストランナー
- React Testing Library：React コンポーネントの振る舞いに基づいたテストを記述するためのライブラリ
- @testing-library/user-event：ユーザー操作のシミュレーションライブラリ

### 検証内容

- コンポーネントのユニットテストとスナップショットテスト
- ユーザーイベント（クリック、入力、送信など）のテスト
- フォームの入力とバリデーションエラーの検証
- API 呼び出しを含む非同期処理のテスト（waitFor, mock）
