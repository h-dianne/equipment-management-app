import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateEquipment } from "../hooks/useEquipment";

// フォームの入力検証
const equipmentFormSchema = z.object({
  name: z.string().min(1, "備品名は必須です"),
  category: z.string().min(1, "カテゴリは必須です"),
  status: z.enum(["使用中", "貸出中", "利用可能", "廃棄"], {
    errorMap: () => ({ message: "有効なステータスを選択してください" })
  }),
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
      status: "利用可能",
      quantity: 1,
      purchaseDate: new Date().toISOString().split("T")[0]
    }
  });

  const onSubmit = (data: EquipmentFormData) => {
    mutate(data, {
      onSuccess: () => {
        reset(); // フォームをリセット
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
              className="block text-sm font-medium text-gray-700"
            >
              備品名<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="例: MacBookノートパソコン"
              {...register("name")}
              aria-invalid={errors.name ? "true" : "false"}
              className={`block w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.name
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            />
            {errors.name && (
              <p
                className="text-sm text-red-600 flex items-center"
                id="name-error"
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* カテゴリ */}
          <div className="space-y-1">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              カテゴリ<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="category"
              type="text"
              placeholder="例: OA機器"
              {...register("category")}
              aria-invalid={errors.category ? "true" : "false"}
              className={`block w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.category
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            />
            {errors.category && (
              <p
                className="text-sm text-red-600 flex items-center"
                id="category-error"
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.category.message}
              </p>
            )}
          </div>

          {/* ステータス */}
          <div className="space-y-1">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              ステータス<span className="ml-1 text-red-500">*</span>
            </label>
            <select
              id="status"
              {...register("status")}
              aria-invalid={errors.status ? "true" : "false"}
              className={`block w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.status
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            >
              <option value="使用中">使用中</option>
              <option value="貸出中">貸出中</option>
              <option value="利用可能">利用可能</option>
              <option value="廃棄">廃棄</option>
            </select>
            {errors.status && (
              <p
                className="text-sm text-red-600 flex items-center"
                id="status-error"
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.status.message}
              </p>
            )}
          </div>

          {/* 在庫数 */}
          <div className="space-y-1">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
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
              className={`block w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.quantity
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            />
            {errors.quantity && (
              <p
                className="text-sm text-red-600 flex items-center"
                id="quantity-error"
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* 保管場所 */}
          <div className="space-y-1">
            <label
              htmlFor="storageLocation"
              className="block text-sm font-medium text-gray-700"
            >
              保管場所<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="storageLocation"
              type="text"
              placeholder="例: 個人デスク"
              {...register("storageLocation")}
              aria-invalid={errors.storageLocation ? "true" : "false"}
              className={`block w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.storageLocation
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            />
            {errors.storageLocation && (
              <p
                className="text-sm text-red-600 flex items-center"
                id="storageLocation-error"
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.storageLocation.message}
              </p>
            )}
          </div>

          {/* 購入日 */}
          <div className="space-y-1">
            <label
              htmlFor="purchaseDate"
              className="block text-sm font-medium text-gray-700"
            >
              購入日<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="purchaseDate"
              type="date"
              {...register("purchaseDate")}
              aria-invalid={errors.purchaseDate ? "true" : "false"}
              className={`block w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.purchaseDate
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            />
            {errors.purchaseDate && (
              <p
                className="text-sm text-red-600 flex items-center"
                id="purchaseDate-error"
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.purchaseDate.message}
              </p>
            )}
          </div>

          {/* 使用者 */}
          <div className="space-y-1">
            <label
              htmlFor="borrower"
              className="block text-sm font-medium text-gray-700"
            >
              使用者
            </label>
            <input
              id="borrower"
              type="text"
              placeholder="例: 山田太郎"
              {...register("borrower")}
              aria-invalid={errors.borrower ? "true" : "false"}
              className={`block w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.borrower
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
            />
            {errors.borrower && (
              <p
                className="text-sm text-red-600 flex items-center"
                id="borrower-error"
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.borrower.message}
              </p>
            )}
          </div>
        </div>

        {/* 備考 */}
        <div className="mt-6 space-y-1">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            備考
          </label>
          <textarea
            id="notes"
            {...register("notes")}
            rows={3}
            placeholder="その他の情報があれば記入してください"
            className={`block w-full rounded-md shadow-sm
              focus:ring focus:ring-gray-200 focus:ring-opacity-50
              transition duration-200 ${
                errors.notes
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
          />
          {errors.notes && (
            <p
              className="text-sm text-red-600 flex items-center"
              id="notes-error"
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {errors.notes.message}
            </p>
          )}
        </div>

        {/* 必須項目の説明 */}
        <div className="mt-4 text-xs text-gray-500 flex items-center">
          <span className="text-red-500 mr-1">*</span>
          必須項目
        </div>

        {/* ボタンコンテナ */}
        <div className="mt-6 flex justify-end space-x-3">
          {/* クリアボタン */}
          <button
            type="button"
            onClick={() => reset()}
            className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md
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
            className="flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md
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
