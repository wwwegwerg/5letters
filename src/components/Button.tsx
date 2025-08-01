export function Button({
  onClick,
  disabled = false,
  value,
}: {
  onClick: () => void;
  disabled?: boolean;
  value: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-sm border-2 border-[#1C1C1E] px-3 font-bold"
    >
      {value}
    </button>
  );
}
