import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { formatDate } from "../../utils/dateUtils";
import { getStatusColor } from "../../utils/statusUtils";
import { useEquipments } from "../../hooks/useEquipment";
import { Equipment } from "../../types/equipment";
import { useDeleteEquipment } from "../../hooks/useEquipment";
import useFilterStore from "../../stores/filterStore";

const EquipmentList = () => {
  // Get filters from global store
  const { categoryFilter, statusFilter } = useFilterStore();
  const hasShownInitialToast = useRef(false);

  const { data, isLoading, isError, isSuccess, refetch } = useEquipments();

  const { mutate: deleteEquipment } = useDeleteEquipment();

  const filteredData = data?.filter((item) => {
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("削除しますか？")) {
      deleteEquipment(id, {
        onError: () => {
          toast.error("削除に失敗しました");
        }
      });
    }
  };

  // 成功時
  useEffect(() => {
    if (isSuccess && data && data.length > 0 && !hasShownInitialToast.current) {
      toast.success("備品データを読み込みました");
      hasShownInitialToast.current = true;
    }
  }, [isSuccess, data]);

  // ローディング時
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-gray-500">読み込み中...</div>
      </div>
    );
  }

  // エラー時
  if (isError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
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
              <p className="text-sm text-red-700">Unexpected Error</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-4 px-3 py-1 text-sm bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  // データが空の場合
  if (isSuccess && (!filteredData || filteredData.length === 0)) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">備品が見つかりませんでした</p>
        </div>
      </div>
    );
  }

  // Render equipment list
  return (
    // Global container
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredData?.map((item: Equipment) => (
          <div
            key={item.id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col"
          >
            {/* カードコンテナ */}
            <div className="px-4 py-5 sm:p-4 flex flex-col flex-grow">
              {/* 備品名とステータス */}
              <div className="mb-2 flex items-start">
                {/* 備品名*/}
                <h3 className="flex-1 mr-2 text-lg font-medium text-gray-900 break-words">
                  {item.name}
                </h3>
                {/* ステータス*/}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              {/* 備品の詳細 */}
              <div className="mt-4 space-y-2">
                {/* カテゴリ */}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">カテゴリ</span>
                  <span className="text-sm text-gray-900">{item.category}</span>
                </div>

                {/* 在庫数 */}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">在庫数</span>
                  <span className="text-sm text-gray-900">{item.quantity}</span>
                </div>

                {/* 保管場所 */}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">保管場所</span>
                  <span className="text-sm text-gray-900">
                    {item.storageLocation}
                  </span>
                </div>

                {/* 使用者 */}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">使用者</span>
                  <span className="text-sm text-gray-900">
                    {item.borrower || "ー"}
                  </span>
                </div>

                {/* 登録日 */}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">登録日</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="px-4 py-3 mt-auto bg-gray-50 ">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                <Link
                  to={`/detail/${item.id}`}
                  className="px-2 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-md
                  hover:bg-blue-100 transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  詳細
                </Link>

                {/* 編集ボタン*/}
                <Link
                  to={`/edit/${item.id}`}
                  className="px-2 py-1.5 text-xs bg-green-50 text-green-700 rounded-md
                  hover:bg-green-100 transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  編集
                </Link>

                {/* 削除ボタン*/}
                <button
                  className="px-2 py-1.5 text-xs bg-red-50 text-red-700 rounded-md
                  hover:bg-red-100 transition-colors flex items-center cursor-pointer"
                  onClick={() => handleDelete(item.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 7a1 1 0 012 0v4a1 1 0 11-2 0V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  削除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentList;
