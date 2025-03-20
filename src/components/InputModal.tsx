import { useEffect, useState } from "react";
import Button, { ButtonSize, ButtonVariant } from "./ui/Button";
import Input, { InputSize } from "./ui/Input";

interface InputModalProps {
  title: string;
  onSubmit: (value: string) => void;
  visible: boolean;
  onClose: () => void;
  submitName?: string;
  initialValue?: string;
  validation?: (value: string) => string | null;
}

const InputModal = ({
  visible,
  onClose,
  title,
  onSubmit,
  submitName = "Submit",
  initialValue = "",
  validation,
}: InputModalProps) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setInputValue(initialValue);
      setError(null);
    }
  }, [visible, initialValue]);

  const handleSubmit = () => {
    const validationError =
      validation?.(inputValue) ||
      (inputValue.length < 1 ? "Input cannot be empty" : null);

    if (validationError) {
      setError(validationError);
      return;
    }

    onSubmit(inputValue);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setInputValue("");
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") handleClose();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative rounded-lg bg-gray-800 p-6 shadow-xl w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyPress}
      >
        <h2 className="text-lg font-medium mb-4 text-center">{title}</h2>

        <Input
          autoFocus
          value={inputValue}
          setValue={setInputValue}
          size={InputSize.Medium}
          className="w-full mb-2"
          aria-invalid={!!error}
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button
            size={ButtonSize.Medium}
            onClick={handleClose}
            variant={ButtonVariant.Secondary}
          >
            Cancel
          </Button>
          <Button size={ButtonSize.Medium} onClick={handleSubmit}>
            {submitName}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InputModal;
