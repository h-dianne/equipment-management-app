import React from "react";

interface DetailItemProps {
  label: string;
  value: string;
  className?: string;
}

/**
 * DetailItem component - Displays a labeled piece of information
 * Used primarily in detail views to show property-value pairs
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
