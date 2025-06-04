import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCreateEquipment } from "./useEquipment";
import { EquipmentEntity, ValidationResult } from "../domain/equipment-entity";
import { CreateEquipmentInput } from "../api/equipmentApi";

export interface EquipmentFormState {
  formData: Partial<CreateEquipmentInput>;
  errors: Record<string, string[]>;
  isSubmitting: boolean;
  hasChanges: boolean;
}

export interface EquipmentFormActions {
  updateField: (
    field: keyof CreateEquipmentInput,
    value: string | number
  ) => void;
  validateField: (field: keyof CreateEquipmentInput) => void;
  validateForm: () => ValidationResult;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  clearErrors: (field?: keyof CreateEquipmentInput) => void;
}

/**
 * 備品フォーム用のドメインフック
 * ビジネスロジックとフォーム状態を統合
 */
export const useEquipmentFormDomain = () => {
  const navigate = useNavigate();
  const { mutate: createEquipment, isPending } = useCreateEquipment();

  // フォーム状態
  const [formData, setFormData] = useState<Partial<CreateEquipmentInput>>(() =>
    EquipmentEntity.getFormDefaults()
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // フィールド更新
  const updateField = useCallback(
    (field: keyof CreateEquipmentInput, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setHasChanges(true);

      // フィールドエラーをクリア（新しい入力時）
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // 個別フィールドバリデーション
  const validateField = useCallback(
    (field: keyof CreateEquipmentInput) => {
      const value = formData[field];
      const fieldErrors = EquipmentEntity.validateField(field, value, formData);

      setErrors((prev) => ({
        ...prev,
        [field]: fieldErrors
      }));

      return fieldErrors.length === 0;
    },
    [formData]
  );

  // フォーム全体のバリデーション
  const validateForm = useCallback((): ValidationResult => {
    const result = EquipmentEntity.validateFormData(formData);

    // エラーをフィールド別に整理
    const fieldErrors: Record<string, string[]> = {};

    // 各フィールドの個別バリデーション
    (Object.keys(formData) as Array<keyof CreateEquipmentInput>).forEach(
      (field) => {
        const value = formData[field];
        const fieldValidationErrors = EquipmentEntity.validateField(
          field,
          value,
          formData
        );
        if (fieldValidationErrors.length > 0) {
          fieldErrors[field] = fieldValidationErrors;
        }
      }
    );

    // 全体のビジネスルールエラーも追加
    if (!result.isValid) {
      // 全体エラーを適切なフィールドに割り当て、または一般的なエラーとして表示
      result.errors.forEach((error) => {
        if (error.includes("備品名")) {
          fieldErrors.name = [...(fieldErrors.name || []), error];
        } else if (error.includes("カテゴリ")) {
          fieldErrors.category = [...(fieldErrors.category || []), error];
        } else if (error.includes("ステータス") && error.includes("使用者")) {
          fieldErrors.borrower = [...(fieldErrors.borrower || []), error];
        } else if (error.includes("ステータス")) {
          fieldErrors.status = [...(fieldErrors.status || []), error];
        } else if (error.includes("数量")) {
          fieldErrors.quantity = [...(fieldErrors.quantity || []), error];
        } else if (error.includes("保管場所")) {
          fieldErrors.storageLocation = [
            ...(fieldErrors.storageLocation || []),
            error
          ];
        } else if (error.includes("購入日")) {
          fieldErrors.purchaseDate = [
            ...(fieldErrors.purchaseDate || []),
            error
          ];
        } else {
          // 一般的なエラー
          fieldErrors.general = [...(fieldErrors.general || []), error];
        }
      });
    }

    setErrors(fieldErrors);
    return result;
  }, [formData]);

  // フォームリセット
  const resetForm = useCallback(() => {
    setFormData(EquipmentEntity.getFormDefaults());
    setErrors({});
    setHasChanges(false);
  }, []);

  // フォーム送信
  const submitForm = useCallback(async () => {
    // バリデーション実行
    const validation = validateForm();

    if (!validation.isValid) {
      toast.error("入力内容に誤りがあります。確認してください。");
      return;
    }

    // 必須フィールドの最終チェック
    const requiredFields: Array<keyof CreateEquipmentInput> = [
      "name",
      "category",
      "status",
      "quantity",
      "storageLocation",
      "purchaseDate"
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("必須項目が入力されていません");
      return;
    }

    try {
      // ドメインロジックでデータを整形
      const submissionData = EquipmentEntity.prepareForSubmission(
        formData as CreateEquipmentInput
      );

      // API送信
      createEquipment(submissionData, {
        onSuccess: () => {
          toast.success("備品を登録しました");
          resetForm();
          navigate("/");
        },
        onError: (error) => {
          console.error("Registration error:", error);
          toast.error("登録に失敗しました");
        }
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("データの準備中にエラーが発生しました");
    }
  }, [formData, validateForm, createEquipment, navigate, resetForm]);

  // エラークリア
  const clearErrors = useCallback((field?: keyof CreateEquipmentInput) => {
    if (field) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } else {
      setErrors({});
    }
  }, []);

  // ビジネスインサイト
  const businessInsights = {
    // データ整合性チェック
    isDataConsistent:
      formData.status && formData.borrower !== undefined
        ? (() => {
            const tempData = {
              status: formData.status,
              borrower: formData.borrower
            };
            return (
              EquipmentEntity.validateBusinessRulesForForm(tempData).length ===
              0
            );
          })()
        : true,

    // フォームの完成度
    completionRate: (() => {
      const totalFields = 6; // 必須フィールド数
      const completedFields = [
        formData.name,
        formData.category,
        formData.status,
        formData.quantity,
        formData.storageLocation,
        formData.purchaseDate
      ].filter((field) => field !== undefined && field !== "").length;

      return Math.round((completedFields / totalFields) * 100);
    })(),

    // 警告があるかどうか
    hasWarnings: Object.values(errors).some((fieldErrors) =>
      fieldErrors.some((error) => error.includes("通常設定しません"))
    )
  };

  return {
    // 状態
    formData,
    errors,
    isSubmitting: isPending,
    hasChanges,
    businessInsights,

    // アクション
    updateField,
    validateField,
    validateForm,
    submitForm,
    resetForm,
    clearErrors
  };
};

/**
 * フォームフィールドのヘルパーフック
 * 個別フィールドの管理を簡単にする
 */
export const useEquipmentFormField = (
  fieldName: keyof CreateEquipmentInput,
  formHook: ReturnType<typeof useEquipmentFormDomain>
) => {
  const { formData, errors, updateField, validateField } = formHook;

  return {
    value: formData[fieldName] || "",
    error: errors[fieldName]?.[0], // 最初のエラーのみ表示
    hasError: Boolean(errors[fieldName]?.length),

    onChange: (value: string | number) => {
      updateField(fieldName, value);
    },

    onBlur: () => {
      validateField(fieldName);
    },

    clearError: () => {
      formHook.clearErrors(fieldName);
    }
  };
};
