import { useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import {
  HiOutlineExclamationCircle,
  HiOutlineExclamationTriangle
} from "react-icons/hi2";

import { formatDate } from "../../utils/dateUtils";
import { getStatusColor } from "../../utils/statusUtils";
import { useEquipmentDomain } from "../../hooks/useEquipmentDomain";
import { EquipmentEntity } from "../../domain/equipment-entity";
import useFilterStore from "../../stores/filterStore";
import LoadingSpinner from "../common/LoadingSpinner";

const EquipmentList = () => {
  // グローバルストアからフィルター取得
  const { categoryFilter, statusFilter, searchQuery } = useFilterStore();

  // ドメインフックを使用（APIフックをラップ）
  const {
    entities,
    isLoading,
    error,
    refetch,
    businessInsights,
    deleteEquipmentWithBusinessRules
  } = useEquipmentDomain();

  // フィルタリングされたエンティティ（ドメインロジック活用）
  const filteredEntities = useMemo(() => {
    let result = entities;

    // カテゴリとステータスフィルター
    result = result.filter((entity) => {
      const data = entity.toData();
      const matchesCategory =
        !categoryFilter || data.category === categoryFilter;
      const matchesStatus = !statusFilter || data.status === statusFilter;
      return matchesCategory && matchesStatus;
    });

    // 検索クエリフィルター
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((entity) => {
        const data = entity.toData();
        return (
          data.name.toLowerCase().includes(query) ||
          data.category.toLowerCase().includes(query) ||
          data.status.toLowerCase().includes(query) ||
          data.storageLocation.toLowerCase().includes(query) ||
          (data.borrower && data.borrower.toLowerCase().includes(query)) ||
          (data.notes && data.notes.toLowerCase().includes(query))
        );
      });
    }

    return result;
  }, [entities, categoryFilter, statusFilter, searchQuery]);

  // ソート済みデータ
  const sortedEntities = useMemo(() => {
    return [...filteredEntities].sort((a, b) =>
      a.name.localeCompare(b.name, "ja")
    );
  }, [filteredEntities]);

  // フィルター後のサマリー
  const filteredStats = useMemo(() => {
    const filteredBusinessInsights = {
      statusSummary: {
        available: filteredEntities.filter((e) => e.status === "利用可能")
          .length,
        borrowed: filteredEntities.filter((e) => e.status === "貸出中").length,
        inUse: filteredEntities.filter((e) => e.status === "使用中").length,
        disposed: filteredEntities.filter((e) => e.status === "廃棄").length,
        total: filteredEntities.length
      },
      deletableEquipments: filteredEntities.filter((e) => e.canBeDeleted()),
      borrowableEquipments: filteredEntities.filter((e) => e.canBeBorrowed()),
      inconsistentEquipments: filteredEntities.filter(
        (e) => !e.hasConsistentData()
      )
    };

    return {
      ...filteredBusinessInsights,
      totalOriginal: entities.length
    };
  }, [filteredEntities, entities.length]);

  // 検索結果メッセージ
  const searchResultMessage = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") return null;

    const resultCount = filteredEntities.length;
    const totalCount = entities.length;

    if (resultCount === 0) {
      return `"${searchQuery}" に一致する備品が見つかりませんでした`;
    }

    if (resultCount === totalCount) {
      return `全ての備品が "${searchQuery}" にマッチしています (${resultCount}件)`;
    }

    return `"${searchQuery}" の検索結果: ${resultCount}件`;
  }, [searchQuery, filteredEntities.length, entities.length]);

  // テキストハイライト関数
  const highlightText = (text: string, query: string) => {
    if (!query || query.trim() === "") return text;

    const regex = new RegExp(`(${query.trim()})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // ドメインロジックを活用した削除ハンドラー
  const handleDelete = async (entity: EquipmentEntity) => {
    try {
      // ビジネスルールチェック
      if (!entity.canBeDeleted()) {
        toast.error("この備品は削除できません（貸出中のため）");
        return;
      }

      if (window.confirm(`${entity.name}を削除しますか？`)) {
        await deleteEquipmentWithBusinessRules(entity);
        toast.success("備品を削除しました");
      }
    } catch (error) {
      console.error("削除エラー:", error);
      toast.error("削除に失敗しました");
    }
  };

  // ローディング状態
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh]">
        <LoadingSpinner type="clip" size="lg" />
        <div className="mt-4 text-gray-500">
          備品データを読み込んでいます...
        </div>
      </div>
    );
  }

  // エラー状態
  if (error) {
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
  if (sortedEntities.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          {searchQuery ? (
            <div>
              <p className="text-gray-500 mb-2">{searchResultMessage}</p>
              <p className="text-sm text-gray-400">
                検索条件を変更するか、フィルターをクリアしてみてください
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-500">備品が見つかりませんでした</p>
              {(categoryFilter || statusFilter) && (
                <p className="text-sm text-gray-400 mt-2">
                  フィルター条件を変更してみてください
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto relative">
      {/* 検索結果メッセージ */}
      {searchResultMessage && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-sm text-blue-700">{searchResultMessage}</p>
        </div>
      )}

      {/* データ整合性警告（ドメインロジック活用） */}
      {businessInsights.inconsistentEquipments.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <div className="flex">
            <HiOutlineExclamationTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                データ不整合の備品があります
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p className="mb-1">
                  以下の備品でデータの不整合が検出されました：
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {businessInsights.inconsistentEquipments
                    .slice(0, 3)
                    .map((entity) => (
                      <li key={entity.id}>
                        <Link
                          to={`/edit/${entity.id}`}
                          className="hover:underline font-medium"
                        >
                          {entity.name}
                        </Link>{" "}
                        (ステータスと使用者情報が一致していません)
                      </li>
                    ))}
                  {businessInsights.inconsistentEquipments.length > 3 && (
                    <li>
                      他 {businessInsights.inconsistentEquipments.length - 3} 件
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ビジネスインサイトサマリー（ドメインロジック活用） */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          サマリー
          {filteredStats.statusSummary.total !==
            filteredStats.totalOriginal && (
            <span className="ml-2 text-xs text-gray-500">
              (表示: {filteredStats.statusSummary.total}件 / 全体:{" "}
              {filteredStats.totalOriginal}件)
            </span>
          )}
        </h3>

        {/* サマリー */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {filteredStats.statusSummary.available}
            </div>
            <div className="text-xs text-gray-500">利用可能</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {filteredStats.statusSummary.inUse}
            </div>
            <div className="text-xs text-gray-500">使用中</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredStats.statusSummary.borrowed}
            </div>
            <div className="text-xs text-gray-500">貸出中</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">
              {filteredStats.statusSummary.disposed}
            </div>
            <div className="text-xs text-gray-500">廃棄</div>
          </div>
        </div>
      </div>

      {/* 備品カード一覧 */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sortedEntities.map((entity: EquipmentEntity) => {
          const data = entity.toData();

          // ドメインロジックで各アクションの可否を判定
          const canDelete = entity.canBeDeleted();
          const canEdit = entity.canBeEdited();
          const hasConsistentData = entity.hasConsistentData();

          return (
            <div
              key={entity.id}
              className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-all duration-200 flex flex-col ${
                !hasConsistentData ? "ring-2 ring-yellow-200" : ""
              }`}
            >
              {/* データ不整合警告 */}
              {!hasConsistentData && (
                <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
                  <div className="flex items-center text-yellow-800 text-xs">
                    <HiOutlineExclamationTriangle className="h-4 w-4 mr-1" />
                    データに不整合があります
                  </div>
                </div>
              )}

              {/* カードコンテンツ */}
              <div className="px-4 py-5 sm:p-4 flex flex-col flex-grow">
                {/* 備品名とステータス */}
                <div className="mb-2 flex items-start">
                  <h3 className="flex-1 mr-2 text-lg font-medium text-gray-900 break-words">
                    {highlightText(data.name, searchQuery || "")}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${getStatusColor(
                      data.status
                    )}`}
                  >
                    {highlightText(data.status, searchQuery || "")}
                  </span>
                </div>

                {/* 備品の詳細 */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">カテゴリ</span>
                    <span className="text-sm text-gray-900">
                      {highlightText(data.category, searchQuery || "")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">在庫数</span>
                    <span className="text-sm text-gray-900">
                      {data.quantity}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">保管場所</span>
                    <span className="text-sm text-gray-900">
                      {highlightText(data.storageLocation, searchQuery || "")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">使用者</span>
                    <span className="text-sm text-gray-900">
                      {data.borrower
                        ? highlightText(data.borrower, searchQuery || "")
                        : "ー"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">登録日</span>
                    <span className="text-sm text-gray-900">
                      {formatDate(data.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="px-4 py-3 mt-auto bg-gray-50">
                <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                  <Link
                    to={`/detail/${entity.id}`}
                    className="px-2 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-md
                    hover:bg-blue-100 transition-colors flex items-center"
                  >
                    <HiOutlineEye className="h-3.5 w-3.5 mr-1" />
                    詳細
                  </Link>

                  {canEdit ? (
                    <Link
                      to={`/edit/${entity.id}`}
                      className="px-2 py-1.5 text-xs bg-green-50 text-green-700 rounded-md
                      hover:bg-green-100 transition-colors flex items-center"
                    >
                      <HiOutlinePencil className="h-3.5 w-3.5 mr-1" />
                      編集
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="px-2 py-1.5 text-xs bg-gray-100 text-gray-400 rounded-md
                      cursor-not-allowed flex items-center"
                      title="廃棄済みのため編集できません"
                    >
                      <HiOutlinePencil className="h-3.5 w-3.5 mr-1" />
                      編集
                    </button>
                  )}

                  {canDelete ? (
                    <button
                      className="px-2 py-1.5 text-xs bg-red-50 text-red-700 rounded-md
                      hover:bg-red-100 transition-colors flex items-center cursor-pointer"
                      onClick={() => handleDelete(entity)}
                    >
                      <HiOutlineTrash className="h-3.5 w-3.5 mr-1" />
                      削除
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-2 py-1.5 text-xs bg-gray-100 text-gray-400 rounded-md
                      cursor-not-allowed flex items-center"
                      title="貸出中のため削除できません"
                    >
                      <HiOutlineTrash className="h-3.5 w-3.5 mr-1" />
                      削除
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EquipmentList;
