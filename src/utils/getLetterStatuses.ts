import type { LetterStatus } from "../types";

export function getLetterStatuses(
  guess: string,
  secret: string,
): LetterStatus[] {
  const result = Array(guess.length).fill("absent");
  const secretLetters = [...secret];
  const usedIndices = Array(secret.length).fill(false);

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret[i]) {
      result[i] = "correct";
      usedIndices[i] = true;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") {
      continue;
    }
    const idx = secretLetters.findIndex(
      (letter, j) => letter === guess[i] && !usedIndices[j],
    );
    if (idx !== -1) {
      result[i] = "present";
      usedIndices[idx] = true;
    }
  }
  return result;
}
