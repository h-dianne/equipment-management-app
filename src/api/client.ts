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
    // TODO: 認証トークンを追加（オプション）
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター - 全てのレスポンス後に実行
apiClient.interceptors.response.use(
  (response) => {
    // 成功レスポンスをそのまま返す
    // 注意: ここでバリデーションを行わない理由は、
    // 各API関数で適切なスキーマバリデーションを行うため
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // 一般的なエラーシナリオを処理
    if (error.response) {
      // サーバーがエラーステータスで応答した場合
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
          // TODO ログインページにリダイレクト（オプション）
          break;
        case 403:
          toast.error("アクセス権限がありません");
          break;
        case 404:
          toast.error("データが見つかりません");
          break;
        case 422:
          // バリデーションエラー
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
      // リクエストは送信されたが、レスポンスが受信されなかった場合
      toast.error(
        "サーバーに接続できません。ネットワーク接続を確認してください。"
      );
    } else {
      // その他のエラーが発生した場合
      toast.error(`予期しないエラーが発生しました: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
