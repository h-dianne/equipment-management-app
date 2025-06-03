import LoadingSpinner from "../common/LoadingSpinner";
import Button from "../ui/Button";

type LoadingButtonProps = {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md";
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
 * @param size - ボタンのサイズ ('sm', 'md')
 */
const LoadingButton = ({
  isLoading,
  loadingText,
  children,
  variant = "primary",
  size = "md",
  ...props
}: LoadingButtonProps) => {
  // Spinner
  const getSpinnerColor = () => {
    switch (variant) {
      case "primary":
      case "danger":
        return "white";
      case "secondary":
      default:
        return "#4B5563"; // gray-600
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <LoadingSpinner
          type="beat"
          size="sm"
          color={getSpinnerColor()}
          className="mr-2"
        />
      )}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </Button>
  );
};
export default LoadingButton;
