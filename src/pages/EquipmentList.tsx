import { useEquipments } from "../hooks/useEquipment";
import { Equipment } from "../api/equipment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EquipmentForm from "../components/EquipmentForm";

// Define status type using the same values as in the Equipment schema
type EquipmentStatus = "使用中" | "貸出中" | "利用可能" | "廃棄";

const statusColor: Record<EquipmentStatus, string> = {
  使用中: "bg-blue-100 text-blue-800",
  貸出中: "bg-yellow-100 text-yellow-800",
  利用可能: "bg-green-100 text-green-800",
  廃棄: "bg-gray-100 text-gray-800"
};

const EquipmentList = () => {
  const { data, isLoading, isError, error, isSuccess, refetch } =
    useEquipments();
  const [showForm, setShowForm] = useState(false);

  // 成功時
  useEffect(() => {
    if (isSuccess && data.length > 0) {
      toast.success("備品データを読み込みました");
    }
  }, [isSuccess, data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-gray-500">読み込み中...</div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">備品一覧</h1>
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
          <button
            className="mt-4 px-4 py-2 bg-primary-600 text-gray-700 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            onClick={() => setShowForm(true)}
          >
            備品を追加
          </button>
        </div>
        {showForm && <EquipmentForm />}
      </div>
    );
  }

  //  備品データが存在する場合
  return (
    // Global container
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">備品一覧</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            更新
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => setShowForm(!showForm)}
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {showForm ? "登録フォームを閉じる" : "備品を追加"}
          </button>
        </div>
      </div>

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
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColor[item.status as EquipmentStatus]
                  }`}
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
                登録日: {new Date(item.createdAt).toLocaleDateString("ja-JP")}
              </div>
              {/* <div className="flex space-x-2">
                <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                  詳細
                </button>
                <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                  編集
                </button>
              </div> */}
            </div>
          </div>
        ))}
      </div>
      {/* Registration Form */}
      {showForm && <EquipmentForm />}
    </div>
  );
};

export default EquipmentList;
