import { forwardRef, MouseEventHandler, ReactNode } from "react";

export enum ButtonSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export enum ButtonVariant {
  Primary = "primary",
  Secondary = "secondary",
  Danger = "danger",
}

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      size = ButtonSize.Medium,
      variant = ButtonVariant.Primary,
      className = "",
      type = "button",
      disabled = false,
      ariaLabel,
    },
    ref
  ) => {
    const sizeClasses = {
      [ButtonSize.Small]: "px-3 py-1 text-sm",
      [ButtonSize.Medium]: "px-4 py-2 text-base",
      [ButtonSize.Large]: "px-6 py-3 text-lg",
    };

    const variantClasses = {
      [ButtonVariant.Primary]: "bg-blue-600 hover:bg-blue-700 text-white",
      [ButtonVariant.Secondary]: "bg-gray-700 hover:bg-gray-600 text-gray-100",
      [ButtonVariant.Danger]: "bg-red-600 hover:bg-red-700 text-white",
    };

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`
            rounded-md font-medium transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${className}
          `}
      >
        {children}
      </button>
    );
  }
);

export default Button;
