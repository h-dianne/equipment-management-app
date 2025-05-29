import { CSSProperties } from "react";
import { ClipLoader, PulseLoader, BeatLoader } from "react-spinners";

type SpinnerType = "clip" | "pulse" | "beat";
type SpinnerSize = "sm" | "md" | "lg";

type LoadingSpinnerProps = {
  type?: SpinnerType;
  size?: SpinnerSize;
  color?: string;
  loading?: boolean;
  className?: string;
};

/**
 * LoadingSpinner コンポーネント - アプリ全体で一貫したローディングインジケーターを提供
 *
 * @param type - 使用するスピナーアニメーションの種類
 * @param size - スピナーのサイズ (sm, md, lg)
 * @param color - スピナーの色 (デフォルト: slate-600)
 * @param loading - スピナーを表示するかどうか
 * @param className - 追加のCSSクラス
 */
const LoadingSpinner = ({
  type = "clip",
  size = "md",
  color = "#475569", // slate-600
  loading = true,
  className = ""
}: LoadingSpinnerProps) => {
  // サイズ名を実際のピクセル値にマッピング
  const sizeMap: Record<SpinnerSize, number> = {
    sm: 16,
    md: 30,
    lg: 50
  };

  const spinnerSize = sizeMap[size];

  // 全スピナータイプ共通のプロパティ
  const commonProps: CSSProperties = {
    display: "block",
    margin: "0 auto"
  };

  // タイプに応じて異なるスピナーをレンダリング
  const renderSpinner = () => {
    switch (type) {
      case "pulse":
        return (
          <PulseLoader
            loading={loading}
            size={spinnerSize / 3}
            color={color}
            cssOverride={commonProps}
          />
        );
      case "beat":
        return (
          <BeatLoader
            loading={loading}
            size={spinnerSize / 2}
            color={color}
            cssOverride={commonProps}
          />
        );
      case "clip":
      default:
        return (
          <ClipLoader
            loading={loading}
            size={spinnerSize}
            color={color}
            cssOverride={commonProps}
          />
        );
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {renderSpinner()}
    </div>
  );
};

export default LoadingSpinner;
