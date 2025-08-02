export type LetterStatus = "correct" | "present" | "absent";

export interface Game {
  secretWord: string;
  maxMoves: number;
  lettersInWord: number;
  wordsDict: string[];
  history: string[];
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
  handleReset: () => void;
}

export type GameState = "new" | "started" | "ended";
