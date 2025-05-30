/**
 * ホームページコンポーネント - フィルタリング機能を備えた備品一覧ページ
 *
 * このコンポーネントは備品一覧を表示し、フィルタリング機能を提供する。
 * URLパラメータとZustandストアの間でフィルタ状態を同期させ、
 * ページの更新やナビゲーション間でフィルタが保持されるようにする。
 */
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";

import EquipmentList from "../components/equipment/EquipmentList";
import useFilterStore from "../stores/filterStore";
import { EquipmentCategory, EquipmentStatus } from "../types/equipment";
import LoadingSpinner from "../components/common/LoadingSpinner";

const HomePage = () => {
  // ナビゲーションとURLクエリパラメータ管理のためのReact Routerフック
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltering, setIsFiltering] = useState(false);

  // ローカル検索入力状態
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const {
    categoryFilter,
    statusFilter,
    searchQuery,
    setCategoryFilter,
    setStatusFilter,
    setSearchQuery,
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
    return !!(categoryFilter || statusFilter || searchQuery);
  }, [categoryFilter, statusFilter, searchQuery]);

  // URLクエリパラメータの解析をメモ化
  const urlParams = useMemo(() => {
    const categoryFromUrl = searchParams.get("category");
    const statusFromUrl = searchParams.get("status");
    const searchFromUrl = searchParams.get("search") || "";

    return {
      category: (categoryFromUrl || "") as EquipmentCategory | "",
      status: (statusFromUrl || "") as EquipmentStatus | "",
      search: searchFromUrl
    };
  }, [searchParams]);

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

  // デバウンス検索処理
  const debouncedSetSearchQuery = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearchQuery(query);
          updateSearchParams("search", query);
        }, 300);
      };
    })(),
    [setSearchQuery, updateSearchParams]
  );

  // 検索入力ハンドラー
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalSearchQuery(value);
      debouncedSetSearchQuery(value);
    },
    [debouncedSetSearchQuery]
  );

  // 検索クリアハンドラー
  const handleSearchClear = useCallback(() => {
    setLocalSearchQuery("");
    setSearchQuery("");
    updateSearchParams("search", "");
  }, [setSearchQuery, updateSearchParams]);

  //  カテゴリ変更ハンドラーをメモ化
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

  // 全フィルタクリアハンドラーをメモ化
  const handleClearFilters = useCallback(() => {
    setIsFiltering(true);
    setLocalSearchQuery("");
    clearFilters();
    navigate("/home", { replace: true });
    setTimeout(() => setIsFiltering(false), 300);
  }, [clearFilters, navigate]);

  // URL同期エフェクト
  useEffect(() => {
    if (
      urlParams.category !== categoryFilter ||
      urlParams.status !== statusFilter ||
      urlParams.search !== searchQuery
    ) {
      setFiltersFromUrl(urlParams.category, urlParams.status);
      if (urlParams.search !== searchQuery) {
        setSearchQuery(urlParams.search);
        setLocalSearchQuery(urlParams.search);
      }
    }
  }, [
    urlParams,
    categoryFilter,
    statusFilter,
    searchQuery,
    setFiltersFromUrl,
    setSearchQuery
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">備品一覧</h1>
        </div>

        {/* 検索バー */}
        <div className="relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineMagnifyingGlass className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="備品名、カテゴリ、保管場所、使用者で検索..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-slate-500 focus:border-slate-500
                       placeholder-gray-500 text-sm"
            />
            {localSearchQuery && (
              <button
                onClick={handleSearchClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center
                         hover:text-gray-600 transition-colors"
              >
                <HiOutlineXMark className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* フィルタリングコントロール */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* カテゴリフィルタードロップダウン */}
          <select
            value={categoryFilter}
            onChange={(e) =>
              handleCategoryChange(e.target.value as EquipmentCategory | "")
            }
            className="px-3 py-2 rounded-md border-gray-300 shadow-sm text-sm focus:border-slate-500 focus:ring-slate-500"
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
            className="px-3 py-2 rounded-md border-gray-300 shadow-sm text-sm focus:border-slate-500 focus:ring-slate-500"
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
              className="px-4 py-2 bg-slate-400 text-sm text-gray-900 rounded-md
                       hover:bg-slate-600 hover:text-white transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              すべてクリア
            </button>
          )}
        </div>

        {/* アクティブフィルターの表示 */}
        {hasActiveFilters && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm font-medium text-blue-700">
                アクティブフィルター:
              </span>
              {searchQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  検索: "{searchQuery}"
                  <button
                    onClick={handleSearchClear}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 text-blue-600 hover:text-blue-800"
                  >
                    <HiOutlineXMark className="w-3 h-3" />
                  </button>
                </span>
              )}
              {categoryFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  カテゴリ: {categoryFilter}
                  <button
                    onClick={() => handleCategoryChange("")}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 text-blue-600 hover:text-blue-800"
                  >
                    <HiOutlineXMark className="w-3 h-3" />
                  </button>
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ステータス: {statusFilter}
                  <button
                    onClick={() => handleStatusChange("")}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 text-blue-600 hover:text-blue-800"
                  >
                    <HiOutlineXMark className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 備品リストコンポーネント */}
      <EquipmentList />
    </div>
  );
};

export default HomePage;
