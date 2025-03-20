import { ChangeEvent, forwardRef, KeyboardEvent } from "react";

export enum InputSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

interface InputProps {
  value: string;
  setValue?: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  size?: InputSize;
  className?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      setValue,
      placeholder,
      onSubmit,
      size = InputSize.Medium,
      className = "",
      disabled = false,
      min,
      max,
      ariaLabel,
      autoFocus = false,
    },
    ref
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setValue?.(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSubmit) {
        onSubmit();
      }
    };

    const sizeClasses = {
      [InputSize.Small]: "h-8 px-2 text-sm",
      [InputSize.Medium]: "h-10 px-3 text-base",
      [InputSize.Large]: "h-12 px-4 text-lg",
    };

    return (
      <input
        ref={ref}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        autoFocus={autoFocus}
        aria-label={ariaLabel || placeholder}
        className={`
            w-full bg-gray-800 border border-gray-600 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-all duration-200
            ${sizeClasses[size]}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${className}
          `}
      />
    );
  }
);
export default Input;
