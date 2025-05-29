import LoadingSpinner from "../common/LoadingSpinner";

type LoadingButtonProps = {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
};

/**
 * LoadingButton - ロード中にスピナーを表示するボタンコンポーネント
 * ロード状態に応じてスピナーと代替テキストを表示するボタンです。
 *
 * @param isLoading - ロード中かどうか (スピナーを表示するかどうか)
 * @param loadingText - ロード中に表示するテキスト
 * @param children - ボタンの内容
 * @param className - 追加のCSSクラス
 * @param type - ボタンタイプ ('button', 'submit', 'reset')
 * @param onClick - クリックハンドラー
 * @param disabled - ボタンを無効化するかどうか
 * @param variant - ボタンのスタイルバリアント ('primary', 'secondary', 'danger')
 */
const LoadingButton = ({
  isLoading,
  loadingText,
  children,
  className = "",
  type = "button",
  onClick,
  disabled = false,
  variant = "primary"
}: LoadingButtonProps) => {
  // スタイルバリアントの定義
  const variantClasses = {
    primary: "bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };

  // 基本的なボタンスタイル
  const baseClasses =
    "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      <div className="flex items-center justify-center">
        {isLoading && (
          <LoadingSpinner
            type="beat"
            size="sm"
            color={
              variant === "primary" || variant === "danger"
                ? "white"
                : "#4B5563"
            }
            className="mr-2"
          />
        )}
        <span>{isLoading && loadingText ? loadingText : children}</span>
      </div>
    </button>
  );
};

export default LoadingButton;
