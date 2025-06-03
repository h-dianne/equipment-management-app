import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md";
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  // Base styles
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed";

  // Size variants
  const sizeStyles = {
    sm: "px-2 py-1.5 text-xs",
    md: "px-4 py-2 text-sm"
  };

  // Color variants using custom colors
  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary-dark focus:ring-primary disabled:bg-gray-300",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400 disabled:bg-gray-50",
    danger:
      "bg-danger text-white hover:bg-red-700 focus:ring-danger disabled:bg-gray-300"
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
