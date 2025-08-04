import type { LetterStatus } from "../types";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Square({
  value,
  status,
}: {
  value: string;
  status: LetterStatus;
}) {
  return (
    <span
      className={twMerge(
        clsx(
          "block h-16 w-16 rounded-sm border-4 border-[#1C1C1E] bg-white text-center text-5xl leading-14 font-bold",
          "lg:h-18 lg:w-18 lg:text-6xl lg:leading-16",
          {
            "border-gray-500 bg-gray-500": status === "absent",
            "border-yellow-500 bg-yellow-500": status === "present",
            "border-green-500 bg-green-500": status === "correct",
          },
        ),
      )}
    >
      {value}
    </span>
  );
}
