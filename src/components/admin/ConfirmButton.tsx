"use client";

import { useFormStatus } from "react-dom";

interface Props {
  children: React.ReactNode;
  message: string;
  pendingText?: string;
  className?: string;
}

export default function ConfirmButton({ children, message, pendingText = "Processing…", className }: Props) {
  const { pending } = useFormStatus();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(message)) {
      e.preventDefault();
    }
  };

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      onClick={handleClick}
      className={className}
    >
      {pending ? pendingText : children}
    </button>
  );
}
