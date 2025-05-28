/**
 * 備品登録フォームコンポーネント
 * このコンポーネントは新しい備品を登録するためのフォームを提供し、バリデーション機能を含みます
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { useCreateEquipment } from "../../hooks/useEquipment";
import { EquipmentSchema } from "../../api/equipmentApi";
import LoadingButton from "../common/LoadingButton";

// APIスキーマから必要な部分を抽出してフォーム用スキーマを作成
const equipmentFormSchema = EquipmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// フォームのデータ型定義（Zodスキーマから型を生成）
type EquipmentFormData = z.infer<typeof equipmentFormSchema>;

// カテゴリとステータスの配列もスキーマから導出
const EQUIPMENT_CATEGORIES = EquipmentSchema.shape.category.options;
const STATUS = EquipmentSchema.shape.status.options;

const EquipmentForm = () => {
  // フォーム送信後の画面遷移用
  const navigate = useNavigate();

  // 備品作成用カスタムフック（React Query使用）
  // isPendingはAPI通信中かどうかを示す
  const { mutate, isPending } = useCreateEquipment();

  // react-hook-formでフォームを初期化
  const {
    register, // 入力フィールドを登録する関数
    handleSubmit, // フォーム送信を処理する関数
    reset, // フォームの値をリセットする関数
    formState: { errors } // フォームのバリデーションエラー
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentFormSchema), // Zodスキーマをバリデーション用に接続
    mode: "onBlur", // フォーカスを失った時にバリデーション
    defaultValues: {
      category: "AV機器・周辺機器",
      status: "利用可能",
      quantity: 1,
      purchaseDate: new Date().toISOString().split("T")[0]
    }
  });

  /**
   * フォーム送信ハンドラ
   * データをAPIに送信し、成功シナリオを処理する
   */
  const onSubmit = (data: EquipmentFormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        navigate("/");
      }
    });
  };

  return (
    <div className="mt-10 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* フォームヘッダー */}
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
            クリア
          </button>

          {/* 送信ボタン */}
          <LoadingButton
            type="submit"
            isLoading={isPending}
            loadingText="登録中..."
            disabled={isPending}
            variant="primary"
            className="flex items-center"
          >
            登録
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default EquipmentForm;
