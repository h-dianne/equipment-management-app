import { useEquipments } from "../../hooks/useEquipment";
import { Equipment } from "../../types/equipment";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateUtils";
import { getStatusColor } from "../../utils/statusUtils";
import toast from "react-hot-toast";

const EquipmentList = () => {
  const { data, isLoading, isError, error, isSuccess, refetch } =
    useEquipments();

  // 成功時
  useEffect(() => {
    if (isSuccess && data.length > 0) {
      toast.success("備品データを読み込みました");
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
              <p className="text-sm text-red-700">
                エラー: {(error as Error).message}
              </p>
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
  if (isSuccess && (!data || data.length === 0)) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-4 text-gray-500">備品が見つかりませんでした</p>
        </div>
      </div>
    );
  }

  //  備品データが存在する場合
  return (
    // Global container
    <div className="p-6 max-w-7xl mx-auto">
      {/* Equipment List */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((item: Equipment) => (
          <div
            key={item.id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            {/* Equipment Card */}
            <div className="px-4 py-5 sm:p-6">
              {/* Equipment Name and Status */}
              <div className="flex justify-between">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {item.name}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              {/* Equipment Details */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">カテゴリ</span>
                  <span className="text-sm text-gray-900">{item.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">在庫数</span>
                  <span className="text-sm text-gray-900">{item.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">保管場所</span>
                  <span className="text-sm text-gray-900">
                    {item.storageLocation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">使用者</span>
                  <span className="text-sm text-gray-900">
                    {item.borrower || "ー"}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-between mt-auto">
              <div className="text-xs text-gray-500">
                登録日: {formatDate(item.createdAt)}
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/detail/${item.id}`}
                  className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-md
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
                <Link
                  to={`/edit/${item.id}`}
                  className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-md
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentList;
