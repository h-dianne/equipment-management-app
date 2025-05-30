/**
 * ホームページコンポーネント - フィルタリング機能を備えた備品一覧ページ
 *
 * このコンポーネントは備品一覧を表示し、フィルタリング機能を提供する。
 * URLパラメータとZustandストアの間でフィルタ状態を同期させ、
 * ページの更新やナビゲーション間でフィルタが保持されるようにする。
 */
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import EquipmentList from "../components/equipment/EquipmentList";
import useFilterStore from "../stores/filterStore";
import { EquipmentCategory, EquipmentStatus } from "../types/equipment";
import LoadingSpinner from "../components/common/LoadingSpinner";

const HomePage = () => {
  // ナビゲーションとURLクエリパラメータ管理のためのReact Routerフック
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltering, setIsFiltering] = useState(false);

  // グローバルストアからフィルタ状態とアクションを取得
  const {
    categoryFilter,
    statusFilter,
    setCategoryFilter,
    setStatusFilter,
    clearFilters,
    setFiltersFromUrl
  } = useFilterStore();

  // 静的なデータなので空配列で依存関係なし
  const categoryOptions = useMemo(
    () => [
      "電子機器",
      "オフィス家具",
      "工具・作業用品",
      "AV機器・周辺機器",
      "消耗品",
      "防災・安全用品",
      "レンタル備品",
      "社用車関連品"
    ],
    []
  );

  // ステータスオプションをメモ化
  const statusOptions = useMemo(
    () => ["使用中", "貸出中", "利用可能", "廃棄"],
    []
  );

  // アクティブフィルターの状態をメモ化
  const hasActiveFilters = useMemo(() => {
    return !!(categoryFilter || statusFilter);
  }, [categoryFilter, statusFilter]);

  // URLクエリパラメータの解析をメモ化
  const urlParams = useMemo(() => {
    const categoryFromUrl = searchParams.get("category");
    const statusFromUrl = searchParams.get("status");

    // カテゴリが許可された値の1つであることを検証
    const isValidCategory = (
      category: string | null
    ): category is EquipmentCategory | "" => {
      return (
        !category || categoryOptions.includes(category as EquipmentCategory)
      );
    };

    // ステータスが許可された値の1つであることを検証
    const isValidStatus = (
      status: string | null
    ): status is EquipmentStatus | "" => {
      return !status || statusOptions.includes(status as EquipmentStatus);
    };

    return {
      category: isValidCategory(categoryFromUrl) ? categoryFromUrl : "",
      status: isValidStatus(statusFromUrl) ? statusFromUrl : ""
    };
  }, [searchParams, categoryOptions, statusOptions]);

  // URLパラメータ更新関数をメモ化
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

  // カテゴリ変更ハンドラーをメモ化
  const handleCategoryChange = useCallback(
    (category: EquipmentCategory | "") => {
      setIsFiltering(true);
      setCategoryFilter(category);
      updateSearchParams("category", category);
      setTimeout(() => setIsFiltering(false), 300);
    },
    [setCategoryFilter, updateSearchParams]
  );

  // ステータス変更ハンドラーをメモ化
  const handleStatusChange = useCallback(
    (status: EquipmentStatus | "") => {
      setIsFiltering(true);
      setStatusFilter(status);
      updateSearchParams("status", status);
      setTimeout(() => setIsFiltering(false), 300);
    },
    [setStatusFilter, updateSearchParams]
  );

  // フィルタクリアハンドラーをメモ化
  const handleClearFilters = useCallback(() => {
    setIsFiltering(true);
    clearFilters();
    navigate("/home", { replace: true });
    setTimeout(() => setIsFiltering(false), 300);
  }, [clearFilters, navigate]);

  // URL同期エフェクト（既存ロジック、パフォーマンス改善）
  useEffect(() => {
    if (
      urlParams.category !== categoryFilter ||
      urlParams.status !== statusFilter
    ) {
      setFiltersFromUrl(urlParams.category, urlParams.status);
    }
  }, [urlParams, categoryFilter, statusFilter, setFiltersFromUrl]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">備品一覧</h1>

        {/* フィルタリングコントロール */}
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
          {/* カテゴリフィルタードロップダウン */}
          <select
            value={categoryFilter}
            onChange={(e) =>
              handleCategoryChange(e.target.value as EquipmentCategory | "")
            }
            className="mx-1 px-2 h-10 rounded-md border-gray-300 shadow-sm text-sm focus:border-slate-500 focus:ring-slate-500"
            disabled={isFiltering}
          >
            <option value="">全てのカテゴリ</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* ステータスフィルタードロップダウン */}
          <select
            value={statusFilter}
            onChange={(e) =>
              handleStatusChange(e.target.value as EquipmentStatus | "")
            }
            className="mx-1 px-2 h-10 rounded-md border-gray-300 shadow-sm text-sm focus:border-slate-500 focus:ring-slate-500"
            disabled={isFiltering}
          >
            <option value="">全てのステータス</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* フィルタリング中のローディングスピナー */}
          {isFiltering && (
            <div className="inline-block">
              <LoadingSpinner type="beat" size="sm" />
            </div>
          )}

          {/* フィルタクリアボタン */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              disabled={isFiltering}
              className="px-3 py-1 bg-slate-400 text-sm text-gray-900 rounded-md hover:bg-slate-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              フィルタをクリア
            </button>
          )}
        </div>
      </div>

      {/* 備品リストコンポーネント */}
      <EquipmentList />
    </div>
  );
};

export default HomePage;
