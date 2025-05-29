import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useEquipmentById } from "../hooks/useEquipment";
import EditEquipmentForm from "../components/equipment/EditEquipmentForm";
import LoadingOverlay from "../components/common/LoadingOverlay";

const EditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  // id を使って特定の備品データを取得
  const { data: equipment, isLoading, isError } = useEquipmentById(id || "");

  // データが取得できたらフォームの初期化済みフラグを設定
  useEffect(() => {
    if (equipment) {
      setIsInitialized(true);
    }
  }, [equipment]);

  // ローディング時
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-gray-500">読み込み中...</div>
      </div>
    );
  }

  // エラー時
  if (isError) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                予期せぬエラーが発生しました。もう一度試してください。
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-3 py-1 text-sm bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  // データが空の場合
  if (!equipment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <p className="text-sm text-yellow-700">
            指定された備品が見つかりませんでした。
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-3 py-1 text-sm bg-white border border-yellow-300 rounded-md hover:bg-yellow-50 transition-colors"
          >
            商品一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">備品編集</h1>

      <LoadingOverlay isLoading={!isInitialized} text="フォームの準備中...">
        {isInitialized && <EditEquipmentForm equipment={equipment} />}
      </LoadingOverlay>
    </div>
  );
};

export default EditPage;
