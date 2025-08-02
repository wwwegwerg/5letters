import { useEffect, useState } from "react";
import type { LetterStatus, GameState } from "./types";
import { getLetterStatuses } from "./utils/getLetterStatuses";
import { normalizeString } from "./utils/normalizeString";
import { Square } from "./components/Square";
import { Button } from "./components/Button";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  const maxMoves = 6;
  const lettersInWord = 5;

  const [gameState, setGameState] = useLocalStorage<GameState>(
    "game_state",
    "new",
  );
  const [secretWord, setSecretWord] = useLocalStorage("secret_word", "");
  const [history, setHistory] = useLocalStorage<string[]>("history", []);
  const [lettersStatus, setLettersStatus] = useLocalStorage<LetterStatus[][]>(
    "letters_statuses",
    [],
  );
  const [wordsDict, setWordsDict] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState(
    `${maxMoves - history.length} moves left`,
  );

  useEffect(() => {
    fetch("/nouns_5_letters.json")
      .then((res) => res.json())
      .then((data) => {
        setWordsDict(data);
        if (!secretWord) {
          const randomIdx = Math.floor(Math.random() * data.length);
          const newWord = data[randomIdx];
          setSecretWord(newWord);
          console.log("Chosen word:", newWord);
        } else {
          console.log("Loaded saved word:", secretWord);
        }
      });
  }, [secretWord, setSecretWord]);

  useEffect(() => {
    if (wordsDict.length !== 0) {
      console.log("words dict got updated:", wordsDict);
    }
  }, [wordsDict]);

  useEffect(() => {
    if (secretWord) {
      console.log("secret word got updated:", secretWord);
    }
  }, [secretWord]);

  function handleReset() {
    setGameState("new");
    setHistory([]);
    setInputValue("");
    setLettersStatus([]);
  }

  function handlePush() {
    const guess = normalizeString(inputValue).toUpperCase();

    if (guess.length !== lettersInWord || !/^[А-Я]+$/.test(guess)) {
      setStatus("\nInvalid input");
      return;
    }

    if (!wordsDict.includes(guess)) {
      setStatus(`${guess} is not a word`);
      return;
    }

    const newStatuses = getLetterStatuses(guess, secretWord);
    const nextHistoryLen = history.length + 1;
    setHistory((prev) => [...prev, guess]);
    setLettersStatus((prev) => [...prev, newStatuses]);

    if (guess === secretWord) {
      setGameState("win");
      setStatus("You won!");
      return;
    }

    if (nextHistoryLen === maxMoves) {
      setGameState("lose");
      setStatus(`You lost! The word is: ${secretWord}`);
      return;
    }

    if (gameState === "new" || gameState === "started") {
      setStatus(`${maxMoves - history.length - 1} moves left`);
      setInputValue("");
    }
  }

  if (!secretWord) return <div>Загрузка...</div>;

  return (
    <>
      <h1 className="my-3 text-center text-4xl font-bold">5 букв</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[calc((100vw-40rem)/2)_40rem_calc((100vw-40rem)/2)]">
        <div className="flex flex-col items-center gap-3 lg:col-start-2">
          <div className="flex flex-col gap-1.5">
            {[...Array(maxMoves).keys()].map((row) => {
              const word = history[row];
              const wordStatus = lettersStatus[row];
              return (
                <div key={row} className="flex flex-row gap-1">
                  {[...Array(lettersInWord).keys()].map((col) => {
                    const idx = row * lettersInWord + col;
                    return (
                      <Square
                        key={idx}
                        value={word?.[col]}
                        status={wordStatus?.[col]}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="flex flex-row gap-2">
            <input
              id="word-input"
              type="text"
              autoFocus
              maxLength={lettersInWord}
              placeholder={`Введите слово`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePush();
                }
              }}
              disabled={gameState === "win" || gameState === "lose"}
              className="rounded-sm border-2 border-[#1C1C1E] text-center"
            />
            <Button
              onClick={handlePush}
              disabled={gameState === "win" || gameState === "lose"}
              value="=>"
            />
          </div>
          <Button onClick={handleReset} value="reset" />
          <span>keyboard?</span>
        </div>
        <div>
          <h1 className="text-2xl">{status}</h1>
        </div>
      </div>
    </>
  );
}
