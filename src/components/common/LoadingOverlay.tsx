import LoadingSpinner from "../common/LoadingSpinner";

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
  spinnerType?: "clip" | "pulse" | "beat";
}

/**
 * LoadingOverlay - ローディング中にコンテンツの上にスピナーを表示
 *
 * @param isLoading - ローディングオーバーレイを表示するかどうか
 * @param text - オプションのローディングテキスト
 * @param children - ローディング時にオーバーレイと一緒にレンダリングするコンテンツ
 * @param spinnerType - 表示するスピナーの種類
 */
const LoadingOverlay = ({
  isLoading,
  text,
  children,
  spinnerType = "clip"
}: LoadingOverlayProps) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm rounded-md">
        <LoadingSpinner type={spinnerType} size="sm" />
        {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingOverlay;
