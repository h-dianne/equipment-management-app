/**
 * 備品登録フォームコンポーネント
 * このコンポーネントは新しい備品を登録するためのフォームを提供し、バリデーション機能を含みます
 */

// src/components/equipment/EquipmentFormDomainZod.tsx
// ドメインロジック + Zod validation の統合版

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";

import { useCreateEquipment } from "../../hooks/useEquipment";
import { EquipmentSchema } from "../../api/equipmentApi";
import { EquipmentEntity } from "../../domain/equipment-entity";
import LoadingButton from "../common/LoadingButton";

// Zodスキーマ定義（基本的なフィールド検証）
const equipmentFormSchema = z
  .object({
    name: z.string().min(1, { message: "備品名は必須です" }),
    category: z.enum(
      [
        "電子機器",
        "オフィス家具",
        "工具・作業用品",
        "AV機器・周辺機器",
        "消耗品",
        "防災・安全用品",
        "レンタル備品",
        "社用車関連品"
      ] as const,
      {
        errorMap: () => ({ message: "有効なカテゴリを選択してください" })
      }
    ),
    status: z.enum(["使用中", "貸出中", "利用可能", "廃棄"] as const, {
      errorMap: () => ({ message: "有効なステータスを選択してください" })
    }),
    quantity: z.number().min(1, { message: "最低1つ以上必要です" }),
    storageLocation: z.string().min(1, { message: "保管場所は必須です" }),
    purchaseDate: z.string().min(1, { message: "購入日は必須です" }),
    borrower: z.string().optional(),
    notes: z.string().optional()
  })
  // ドメインロジックを使ったカスタムバリデーション
  .refine(
    (data) => {
      // ドメインエンティティのビジネスルール検証を使用
      const businessRuleErrors =
        EquipmentEntity.validateBusinessRulesForForm(data);
      return businessRuleErrors.length === 0;
    },
    {
      message: "ビジネスルール違反があります",
      path: ["root"] // エラーをルートレベルに設定
    }
  )
  // 個別のビジネスルール検証
  .refine(
    (data) => {
      // 貸出中の場合は使用者必須
      if (data.status === "貸出中") {
        return data.borrower && data.borrower.trim().length > 0;
      }
      return true;
    },
    {
      message: "ステータスが「貸出中」の場合、使用者の入力は必須です",
      path: ["borrower"]
    }
  )
  .refine(
    (data) => {
      // 購入日の未来日チェック
      if (data.purchaseDate) {
        const today = new Date().toISOString().split("T")[0];
        return data.purchaseDate <= today;
      }
      return true;
    },
    {
      message: "購入日は未来の日付にできません",
      path: ["purchaseDate"]
    }
  );

// フォームのデータ型定義
type EquipmentFormData = z.infer<typeof equipmentFormSchema>;

// カテゴリとステータスの配列
const EQUIPMENT_CATEGORIES = EquipmentSchema.shape.category.options;
const STATUS = EquipmentSchema.shape.status.options;

const EquipmentForm = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateEquipment();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setError,
    clearErrors
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

  // フォームデータを監視
  const formData = watch();

  // ドメインロジックによるビジネスインサイト
  const businessInsights = useMemo(
    () => ({
      // フォーム完成度
      completionRate: (() => {
        const requiredFields = [
          "name",
          "category",
          "status",
          "quantity",
          "storageLocation",
          "purchaseDate"
        ];
        const completedFields = requiredFields.filter((field) => {
          const value = formData[field as keyof EquipmentFormData];
          return value !== undefined && value !== "";
        }).length;
        return Math.round((completedFields / requiredFields.length) * 100);
      })(),

      // データ整合性チェック（ドメインロジック使用）
      isDataConsistent: (() => {
        const businessErrors =
          EquipmentEntity.validateBusinessRulesForForm(formData);
        return businessErrors.length === 0;
      })(),

      // 警告の有無
      hasWarnings: (() => {
        const businessErrors =
          EquipmentEntity.validateBusinessRulesForForm(formData);
        return businessErrors.some((error) =>
          error.includes("通常設定しません")
        );
      })(),

      // ビジネスルールエラー取得
      getBusinessErrors: () => {
        return EquipmentEntity.validateBusinessRulesForForm(formData);
      }
    }),
    [formData]
  );

  // ステータス変更時のリアルタイムビジネスルール検証
  useEffect(() => {
    const businessErrors = businessInsights.getBusinessErrors();

    // 既存のビジネスルールエラーをクリア
    clearErrors("borrower");

    // 新しいビジネスルールエラーを設定
    businessErrors.forEach((error) => {
      if (error.includes("使用者") && error.includes("必須")) {
        setError("borrower", {
          type: "business",
          message: error
        });
      } else if (error.includes("通常設定しません")) {
        setError("borrower", {
          type: "warning",
          message: error
        });
      }
    });
  }, [
    formData.status,
    formData.borrower,
    setError,
    clearErrors,
    businessInsights
  ]);

  // フォーム送信ハンドラー
  const onSubmit = (data: EquipmentFormData) => {
    // ドメインロジックによる最終検証
    const validation = EquipmentEntity.validateFormData(data);

    if (!validation.isValid) {
      console.error("Domain validation failed:", validation.errors);
      // Zodで捕捉されなかったビジネスルールエラーがある場合
      return;
    }

    // ドメインロジックでデータを整形
    const preparedData = EquipmentEntity.prepareForSubmission(data);

    // API送信
    mutate(preparedData, {
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
              <p className="text-base text-red-600" id="name-error">
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
              <option value="">選択してください</option>
              {EQUIPMENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-base text-red-600" id="category-error">
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
              <option value="">選択してください</option>
              {STATUS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-base text-red-600" id="status-error">
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
              max="9999"
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
              <p className="text-base text-red-600" id="quantity-error">
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
              <p className="text-base text-red-600" id="storageLocation-error">
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
              <p className="text-base text-red-600" id="purchaseDate-error">
                {errors.purchaseDate.message}
              </p>
            )}
          </div>

          {/* 使用者（ドメインロジック統合） */}
          <div className="space-y-1">
            <label
              htmlFor="borrower"
              className="block text-base font-medium text-gray-700"
            >
              使用者
              {formData.status === "貸出中" && (
                <span className="ml-1 text-red-500">*</span>
              )}
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
                className={`text-base ${
                  errors.borrower.message?.includes("通常設定しません")
                    ? "text-yellow-600" // 警告
                    : "text-red-600" // エラー
                }`}
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
        </div>

        {/* ボタンコンテナ */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => reset()}
            className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md
            text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400
            transition duration-200"
          >
            リセット
          </button>

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
