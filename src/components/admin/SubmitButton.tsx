"use client";

import { useFormStatus } from "react-dom";

interface Props {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  disabled?: boolean;
}

export default function SubmitButton({ children, pendingText = "Saving…", className, disabled }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-disabled={pending || disabled}
      className={className}
    >
      {pending ? pendingText : children}
    </button>
  );
}
