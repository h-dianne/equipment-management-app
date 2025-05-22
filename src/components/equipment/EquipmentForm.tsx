import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateEquipment } from "../../hooks/useEquipment";
import { EquipmentStatus, EquipmentCategory } from "../../types/equipment";

// カテゴリの定義 - 型定義から配列を作成
const EQUIPMENT_CATEGORIES: readonly EquipmentCategory[] = [
  "電子機器",
  "オフィス家具",
  "工具・作業用品",
  "AV機器・周辺機器",
  "消耗品",
  "防災・安全用品",
  "レンタル備品",
  "社用車関連品"
];
// ステータスの定義 - 型定義から配列を作成
const STATUS: readonly EquipmentStatus[] = [
  "使用中",
  "貸出中",
  "利用可能",
  "廃棄"
];

// フォームの入力検証
const equipmentFormSchema = z.object({
  name: z.string().min(1, "備品名は必須です"),
  category: z.custom<EquipmentCategory>(
    (val) => EQUIPMENT_CATEGORIES.includes(val as EquipmentCategory),
    {
      message: "有効なカテゴリを選択してください"
    }
  ),
  status: z.custom<EquipmentStatus>(
    (val) => STATUS.includes(val as EquipmentStatus),
    {
      message: "有効なステータスを選択してください"
    }
  ),
  quantity: z
    .number({ invalid_type_error: "数値を入力してください" })
    .min(1, "最低1つ以上必要です"),
  storageLocation: z.string().min(1, "保管場所は必須です"),
  purchaseDate: z.string().min(1, "購入日は必須です"),
  borrower: z.string().optional(),
  notes: z.string().optional()
});

type EquipmentFormData = z.infer<typeof equipmentFormSchema>;

const EquipmentForm = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateEquipment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentFormSchema),
    mode: "onBlur",
    defaultValues: {
      category: "AV機器・周辺機器",
      status: "利用可能",
      quantity: 1,
      purchaseDate: new Date().toISOString().split("T")[0]
    }
  });

  const onSubmit = (data: EquipmentFormData) => {
    mutate(data, {
      onSuccess: () => {
        reset(); // フォームをリセット
        navigate("/"); // ホームページにリダイレクト
      }
    });
  };

  return (
    <div className="mt-10 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-gray-600 to-gray-500 py-4 px-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          備品登録
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 備品名 */}
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block text-base font-medium text-gray-700"
            >
              備品名<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="例: MacBookノートパソコン"
              {...register("name")}
              aria-invalid={errors.name ? "true" : "false"}
              className={`block my-2 p-2 h-10 w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.name
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            />
            {errors.name && (
              <p
                className="text-base text-red-600 flex items-center"
                id="name-error"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* カテゴリ */}
          <div className="space-y-1">
            <label
              htmlFor="category"
              className="block text-base font-medium text-gray-700"
            >
              カテゴリ<span className="ml-1 text-red-500">*</span>
            </label>
            <select
              id="category"
              {...register("category")}
              aria-invalid={errors.category ? "true" : "false"}
              className={`block my-2 p-2 h-10 w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.category
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            >
              <option value=""></option>
              {EQUIPMENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p
                className="text-base text-red-600 flex items-center"
                id="category-error"
              >
                {errors.category.message}
              </p>
            )}
          </div>

          {/* ステータス */}
          <div className="space-y-1">
            <label
              htmlFor="status"
              className="block text-base font-medium text-gray-700"
            >
              ステータス<span className="ml-1 text-red-500">*</span>
            </label>
            <select
              id="status"
              {...register("status")}
              aria-invalid={errors.status ? "true" : "false"}
              className={`block my-2 p-2 h-10 w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.status
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            >
              <option value=""></option>
              {STATUS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <p
                className="text-base text-red-600 flex items-center"
                id="status-error"
              >
                {errors.status.message}
              </p>
            )}
          </div>

          {/* 在庫数 */}
          <div className="space-y-1">
            <label
              htmlFor="quantity"
              className="block text-base font-medium text-gray-700"
            >
              在庫数<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              placeholder="例: 1"
              {...register("quantity", { valueAsNumber: true })}
              aria-invalid={errors.quantity ? "true" : "false"}
              className={`block my-2 p-2 h-10 w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.quantity
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            />
            {errors.quantity && (
              <p
                className="text-base text-red-600 flex items-center"
                id="quantity-error"
              >
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* 保管場所 */}
          <div className="space-y-1">
            <label
              htmlFor="storageLocation"
              className="block text-base font-medium text-gray-700"
            >
              保管場所<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="storageLocation"
              type="text"
              placeholder="例: 個人デスク"
              {...register("storageLocation")}
              aria-invalid={errors.storageLocation ? "true" : "false"}
              className={`block my-2 p-2 h-10 w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.storageLocation
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            />
            {errors.storageLocation && (
              <p
                className="text-base text-red-600 flex items-center"
                id="storageLocation-error"
              >
                {errors.storageLocation.message}
              </p>
            )}
          </div>

          {/* 購入日 */}
          <div className="space-y-1">
            <label
              htmlFor="purchaseDate"
              className="block text-base font-medium text-gray-700"
            >
              購入日<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="purchaseDate"
              type="date"
              {...register("purchaseDate")}
              aria-invalid={errors.purchaseDate ? "true" : "false"}
              className={`block my-2 p-2 h-10 w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.purchaseDate
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            />
            {errors.purchaseDate && (
              <p
                className="text-base text-red-600 flex items-center"
                id="purchaseDate-error"
              >
                {errors.purchaseDate.message}
              </p>
            )}
          </div>

          {/* 使用者 */}
          <div className="space-y-1">
            <label
              htmlFor="borrower"
              className="block text-base font-medium text-gray-700"
            >
              使用者
            </label>
            <input
              id="borrower"
              type="text"
              placeholder="例: 山田太郎"
              {...register("borrower")}
              aria-invalid={errors.borrower ? "true" : "false"}
              className={`block my-2 p-2 h-10 w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.borrower
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            />
            {errors.borrower && (
              <p
                className="text-base text-red-600 flex items-center"
                id="borrower-error"
              >
                {errors.borrower.message}
              </p>
            )}
          </div>
        </div>

        {/* 備考 */}
        <div className="mt-6 space-y-1">
          <label
            htmlFor="notes"
            className="block text-base font-medium text-gray-700"
          >
            備考
          </label>
          <textarea
            id="notes"
            {...register("notes")}
            rows={3}
            placeholder="その他の情報があれば記入してください"
            className={`block my-2 p-2 w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.notes
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
          />
          {errors.notes && (
            <p
              className="text-base text-red-600 flex items-center"
              id="notes-error"
            >
              {errors.notes.message}
            </p>
          )}
        </div>

        {/* 必須項目の説明 */}
        <div className="mt-4 text-base text-gray-500 flex items-center">
          <span className="text-red-500 mr-1">*</span>
          必須項目
        </div>

        {/* ボタンコンテナ */}
        <div className="mt-6 flex justify-end space-x-3">
          {/* クリアボタン */}
          <button
            type="button"
            onClick={() => reset()}
            className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md
            text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400
            transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            クリア
          </button>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md
            text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500
            disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {isPending ? "登録中..." : "登録"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentForm;
