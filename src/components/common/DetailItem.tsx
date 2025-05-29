import React from "react";

type DetailItemProps = {
  label: string;
  value: string;
  className?: string;
};

/**
 * DetailItemコンポーネント - ラベル付き情報を表示します
 * 主に詳細ビューでプロパティと値のペアを表示するために使用されます
 */
const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  className = ""
}) => (
  <div className={className}>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
  </div>
);

export default DetailItem;
