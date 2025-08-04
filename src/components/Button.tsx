import type React from "react";

export function Button({
  onClick,
  disabled = false,
  value,
  type = "button",
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="rounded-sm border-2 border-[#1C1C1E] px-3 font-bold"
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {value}
    </button>
  );
}
