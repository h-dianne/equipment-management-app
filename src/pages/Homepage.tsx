/**
 * ホームページコンポーネント - フィルタリング機能を備えた備品一覧ページ
 *
 * このコンポーネントは備品一覧を表示し、フィルタリング機能を提供する。
 * URLパラメータとZustandストアの間でフィルタ状態を同期させ、
 * ページの更新やナビゲーション間でフィルタが保持されるようにする。
 */
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import EquipmentList from "../components/equipment/EquipmentList";
import useFilterStore from "../stores/filterStore";
import { EquipmentCategory, EquipmentStatus } from "../types/equipment";

const HomePage = () => {
  // ナビゲーションとURLクエリパラメータ管理のためのReact Routerフック
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // グローバルストアからフィルタ状態とアクションを取得
  const {
    categoryFilter,
    statusFilter,
    setCategoryFilter,
    setStatusFilter,
    clearFilters,
    setFiltersFromUrl
  } = useFilterStore();

  /**
   * コンポーネントマウント時とURL変更時にURLクエリパラメータからフィルタを同期
   *
   * このエフェクトはURLパラメータが変更されるたびに実行され、ZustandストアのフィルタステートがURLと
   * 一致するようにする。
   */
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") as
      | EquipmentCategory
      | "";
    const statusFromUrl = searchParams.get("status") as EquipmentStatus | "";

    if (categoryFromUrl !== categoryFilter || statusFromUrl !== statusFilter) {
      setFiltersFromUrl(categoryFromUrl || "", statusFromUrl || "");
    }
  }, [searchParams, setFiltersFromUrl, categoryFilter, statusFilter]);

  /**
   * カテゴリフィルターの変更を処理
   * ストア状態とURLパラメータの両方を更新
   */
  const handleCategoryChange = (category: EquipmentCategory | "") => {
    setCategoryFilter(category);
    updateSearchParams("category", category);
  };

  /**
   * ステータスフィルターの変更を処理
   * ストア状態とURLパラメータの両方を更新
   */
  const handleStatusChange = (status: EquipmentStatus | "") => {
    setStatusFilter(status);
    updateSearchParams("status", status);
  };

  /**
   * URLクエリパラメータを更新するためのヘルパー関数
   *
   * @param key - 更新するパラメータ名
   * @param value - 新しい値（空の文字列はパラメータを削除）
   */
  const updateSearchParams = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    setSearchParams(newSearchParams);
  };

  /**
   * 全てのフィルタをクリアしてURLをリセット
   * ストア状態をリセットし、クリーンなURLに移動
   */
  const handleClearFilters = () => {
    clearFilters();
    navigate("/home", { replace: true });
  };

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
          >
            <option value="">全てのカテゴリ</option>
            <option value="電子機器">電子機器</option>
            <option value="オフィス家具">オフィス家具</option>
            <option value="工具・作業用品">工具・作業用品</option>
            <option value="AV機器・周辺機器">AV機器・周辺機器</option>
            <option value="消耗品">消耗品</option>
            <option value="防災・安全用品">防災・安全用品</option>
            <option value="レンタル備品">レンタル備品</option>
            <option value="社用車関連品">社用車関連品</option>
          </select>

          {/* ステータスフィルタードロップダウン */}
          <select
            value={statusFilter}
            onChange={(e) =>
              handleStatusChange(e.target.value as EquipmentStatus | "")
            }
            className="mx-1 px-2 h-10 rounded-md border-gray-300 shadow-sm text-sm focus:border-slate-500 focus:ring-slate-500"
          >
            <option value="">全てのステータス</option>
            <option value="使用中">使用中</option>
            <option value="貸出中">貸出中</option>
            <option value="利用可能">利用可能</option>
            <option value="廃棄">廃棄</option>
          </select>

          {/* フィルタをクリアするボタン - フィルタが有効な場合のみ表示 */}
          {(categoryFilter || statusFilter) && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-1 bg-slate-400 text-sm text-gray-900 rounded-md hover:bg-slate-600 hover:text-white transition-colors"
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
