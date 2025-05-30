import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import { formatDate } from "../../utils/dateUtils";
import { getStatusColor } from "../../utils/statusUtils";
import { useEquipments } from "../../hooks/useEquipment";
import { Equipment } from "../../types/equipment";
import { useDeleteEquipment } from "../../hooks/useEquipment";
import useFilterStore from "../../stores/filterStore";

const EquipmentList = () => {
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
              <HiOutlineExclamationCircle className="h-5 w-5 text-red-500" />
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
                  <HiOutlineEye className="h-3.5 w-3.5 mr-1" />
                  詳細
                </Link>

                {/* 編集ボタン*/}
                <Link
                  to={`/edit/${item.id}`}
                  className="px-2 py-1.5 text-xs bg-green-50 text-green-700 rounded-md
                  hover:bg-green-100 transition-colors flex items-center"
                >
                  <HiOutlinePencil className="h-3.5 w-3.5 mr-1" />
                  編集
                </Link>

                {/* 削除ボタン*/}
                <button
                  className="px-2 py-1.5 text-xs bg-red-50 text-red-700 rounded-md
                  hover:bg-red-100 transition-colors flex items-center cursor-pointer"
                  onClick={() => handleDelete(item.id)}
                >
                  <HiOutlineTrash className="h-3.5 w-3.5 mr-1" />
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
