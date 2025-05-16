import { useNavigate } from "react-router-dom";
import EquipmentList from "../components/equipment/EquipmentList";
import useFilterStore from "../stores/filterStore";
import { EquipmentCategory, EquipmentStatus } from "../types/equipment";

const HomePage = () => {
  const {
    categoryFilter,
    statusFilter,
    setCategoryFilter,
    setStatusFilter,
    clearFilters
  } = useFilterStore();

  const navigate = useNavigate();

  const updateUrl = () => {
    const params = new URLSearchParams();
    if (categoryFilter) params.set("category", categoryFilter);
    if (statusFilter) params.set("status", statusFilter);
    navigate({ search: params.toString() }, { replace: true });
  };

  // フィルタリング機能
  const handleCategoryChange = (category: EquipmentCategory | "") => {
    setCategoryFilter(category);
    updateUrl();
  };

  const handleStatusChange = (status: EquipmentStatus | "") => {
    setStatusFilter(status);
    updateUrl();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">備品一覧</h1>

        {/* フィルタリング */}
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
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

          {(categoryFilter || statusFilter) && (
            <button
              onClick={() => {
                clearFilters();
                navigate("/home", { replace: true });
              }}
              className="px-3 py-1 bg-slate-400 text-sm text-gray-900 rounded-md hover:bg-slate-600 hover:text-white transition-colors"
            >
              フィルタをクリア
            </button>
          )}
        </div>
      </div>

      <EquipmentList />
    </div>
  );
};

export default HomePage;
