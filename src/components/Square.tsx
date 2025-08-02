import type { LetterStatus } from "../types";

export function Square({
  value,
  status,
}: {
  value: string;
  status: LetterStatus;
}) {
  const bgColor = status
    ? status === "absent"
      ? "bg-gray-500"
      : status === "present"
        ? "bg-yellow-500"
        : "bg-green-500"
    : "bg-white";
  const borderColor = status
    ? status === "absent"
      ? "border-gray-500"
      : status === "present"
        ? "border-yellow-500"
        : "border-green-500"
    : "border-[#1C1C1E]";
  return (
    <span
      className={`block h-16 w-16 rounded-sm border-4 text-center text-5xl leading-14 font-bold lg:h-18 lg:w-18 lg:text-6xl lg:leading-16 ${bgColor} ${borderColor}`}
    >
      {value}
    </span>
  );
}
