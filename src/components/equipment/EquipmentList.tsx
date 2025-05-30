import { useEffect, useMemo } from "react";
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
import LoadingSpinner from "../common/LoadingSpinner";

const EquipmentList = () => {
  // グローバルストアからフィルターを取得
  const { categoryFilter, statusFilter } = useFilterStore();

  const { data, isLoading, isFetching, isError, isSuccess, refetch, status } =
    useEquipments();

  const { mutate: deleteEquipment, isPending: isDeleting } =
    useDeleteEquipment();

  // データまたはフィルターが変更された時のみ再計算
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      const matchesCategory =
        !categoryFilter || item.category === categoryFilter;
      const matchesStatus = !statusFilter || item.status === statusFilter;
      return matchesCategory && matchesStatus;
    });
  }, [data, categoryFilter, statusFilter]);

  // ダッシュボードやサマリー表示に使用可能
  const equipmentStats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        total: 0,
        available: 0,
        inUse: 0,
        borrowed: 0,
        disposed: 0
      };
    }

    return {
      total: data.length,
      available: data.filter((item) => item.status === "利用可能").length,
      inUse: data.filter((item) => item.status === "使用中").length,
      borrowed: data.filter((item) => item.status === "貸出中").length,
      disposed: data.filter((item) => item.status === "廃棄").length
    };
  }, [data]);

  // カテゴリ別表示やレポート機能に使用可能
  // const groupedByCategory = useMemo(() => {
  //   if (!filteredData || filteredData.length === 0) return {};

  //   return filteredData.reduce((groups, item) => {
  //     const category = item.category;
  //     if (!groups[category]) {
  //       groups[category] = [];
  //     }
  //     groups[category].push(item);
  //     return groups;
  //   }, {} as Record<string, Equipment[]>);
  // }, [filteredData]);

  // 名前順でソートしたデータ
  const sortedData = useMemo(() => {
    if (!filteredData) return [];

    return [...filteredData].sort((a, b) => a.name.localeCompare(b.name, "ja"));
  }, [filteredData]);

  // 削除ハンドラー
  const handleDelete = (id: string) => {
    if (window.confirm("削除しますか？")) {
      deleteEquipment(id, {
        onError: () => {
          toast.error("削除に失敗しました");
        }
      });
    }
  };

  // 成功時のトースト
  useEffect(() => {
    if (isSuccess && data && data.length > 0) {
      toast.success("備品データを読み込みました");
    }
  }, [isSuccess, data]);

  // ローディング状態
  if (isLoading || status === "pending" || (!data && isFetching)) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh]">
        <LoadingSpinner type="clip" size="lg" />
        <div className="mt-4 text-gray-500">
          備品データを読み込んでいます...
        </div>
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
              <p className="text-sm text-red-700">
                データの読み込みに失敗しました
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
  if (isSuccess && (!filteredData || filteredData.length === 0)) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">備品が見つかりませんでした</p>
          {(categoryFilter || statusFilter) && (
            <p className="text-sm text-gray-400 mt-2">
              フィルター条件を変更してみてください
            </p>
          )}

          {/* 統計情報の表示例 */}
          {equipmentStats.total > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              全体: {equipmentStats.total}件 (利用可能:{" "}
              {equipmentStats.available}件)
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto relative">
      {isFetching && !isLoading && data && (
        <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg p-3 border">
          <div className="flex items-center">
            <LoadingSpinner type="beat" size="sm" className="mr-2" />
            <span className="text-sm text-gray-600">更新中...</span>
          </div>
        </div>
      )}

      {/* 統計情報の表示 */}
      {equipmentStats.total > 0 && (
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">統計情報</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {equipmentStats.total}
              </div>
              <div className="text-xs text-gray-500">合計</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {equipmentStats.available}
              </div>
              <div className="text-xs text-gray-500">利用可能</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {equipmentStats.inUse}
              </div>
              <div className="text-xs text-gray-500">使用中</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {equipmentStats.borrowed}
              </div>
              <div className="text-xs text-gray-500">貸出中</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {equipmentStats.disposed}
              </div>
              <div className="text-xs text-gray-500">廃棄</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sortedData.map((item: Equipment) => (
          <div
            key={item.id}
            className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-all duration-200 flex flex-col ${
              isFetching && data ? "opacity-75" : "opacity-100"
            }`}
          >
            {/* カードコンテナ */}
            <div className="px-4 py-5 sm:p-4 flex flex-col flex-grow">
              {/* 備品名とステータス */}
              <div className="mb-2 flex items-start">
                <h3 className="flex-1 mr-2 text-lg font-medium text-gray-900 break-words">
                  {item.name}
                </h3>
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

                <Link
                  to={`/edit/${item.id}`}
                  className="px-2 py-1.5 text-xs bg-green-50 text-green-700 rounded-md
                  hover:bg-green-100 transition-colors flex items-center"
                >
                  <HiOutlinePencil className="h-3.5 w-3.5 mr-1" />
                  編集
                </Link>

                <button
                  className="px-2 py-1.5 text-xs bg-red-50 text-red-700 rounded-md
                  hover:bg-red-100 transition-colors flex items-center cursor-pointer disabled:opacity-50"
                  onClick={() => handleDelete(item.id)}
                  disabled={isDeleting}
                >
                  <HiOutlineTrash className="h-3.5 w-3.5 mr-1" />
                  削除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* カテゴリ別表示のデバッグ情報（開発時のみ） */}
      {/* {process.env.NODE_ENV === "development" &&
        Object.keys(groupedByCategory).length > 0 && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              カテゴリ別アイテム数（開発モード）:
            </h4>
            <div className="text-xs text-gray-600">
              {Object.entries(groupedByCategory).map(([category, items]) => (
                <span key={category} className="mr-4">
                  {category}: {items.length}件
                </span>
              ))}
            </div>
          </div>
        )} */}
    </div>
  );
};

export default EquipmentList;
