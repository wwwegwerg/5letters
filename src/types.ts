export type LetterStatus = "correct" | "present" | "absent";

export interface Game {
  secretWord: string;
  maxMoves: number;
  lettersInWord: number;
  wordsDict: string[];
}

export type GameState = "started" | "new" | "ended";
