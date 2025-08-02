import { useEffect, useState } from "react";
import type { LetterStatus, Game, GameState } from "./types";
import { getLetterStatuses } from "./utils/getLetterStatuses";
import { normalizeString } from "./utils/normalizeString";
import { Square } from "./components/Square";
import { Button } from "./components/Button";
import { useLocalStorage } from "./utils/useLocalStorage";

export default function App() {
  const [words, setWords] = useState<string[]>([]);
  const [gameState, setGameState] = useLocalStorage<GameState>(
    "game_state",
    "new",
  );
  const [secretWord, setSecretWord] = useLocalStorage("secret_word", "");
  const [history, setHistory] = useLocalStorage<string[]>("history", []);

  function handleReset() {
    setGameState("new");
    setHistory([]);
  }

  useEffect(() => {
    fetch("/nouns_5_letters.json")
      .then((res) => res.json())
      .then((data) => {
        setWords(data);
        const randomIdx = Math.floor(Math.random() * data.length);
        if (gameState !== "started") {
          setSecretWord(data[randomIdx]);
        }
        // TODO: remove
        console.log(data[randomIdx]);
      });
  }, [gameState, setSecretWord]);

  if (!secretWord) return <div>Загрузка...</div>;

  return (
    <Game
      lettersInWord={5}
      secretWord={secretWord}
      wordsDict={words}
      maxMoves={6}
      history={history}
      setHistory={setHistory}
      handleReset={handleReset}
    />
  );
}

function Game({
  secretWord,
  maxMoves,
  lettersInWord,
  wordsDict,
  history,
  setHistory,
  handleReset,
}: Game) {
  const [inputValue, setInputValue] = useState("");
  const [gameStatus, setGameStatus] = useState(
    `${maxMoves - history.length} moves left`,
  );
  const [lettersStatus, setLettersStatus] = useState<LetterStatus[][]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  function handlePush() {
    const guess = normalizeString(inputValue).toUpperCase();
    // TODO: remove
    console.log(secretWord);
    console.log("input: " + guess);
    if (guess.length !== lettersInWord || !/^[А-ЯЁ]+$/.test(guess)) {
      setGameStatus("\nInvalid input");
      return;
    }

    if (!wordsDict.includes(guess)) {
      setGameStatus(`${guess} is not a word`);
      return;
    }

    const newStatuses = getLetterStatuses(guess, secretWord);
    const nextHistoryLen = history.length + 1;
    setHistory((prev) => [...prev, guess]);
    setLettersStatus((prev) => [...prev, newStatuses]);

    if (guess === secretWord) {
      setIsGameOver(true);
      setGameStatus("You won!");
      return;
    }

    if (nextHistoryLen === maxMoves) {
      setIsGameOver(true);
      setGameStatus(`You lost! The word is: ${secretWord}`);
      return;
    }

    if (!isGameOver) {
      setGameStatus(`${maxMoves - history.length - 1} moves left`);
      setInputValue("");
    }
  }

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
              disabled={isGameOver}
              className="rounded-sm border-2 border-[#1C1C1E] text-center"
            />
            <Button onClick={handlePush} disabled={isGameOver} value="=>" />
          </div>
          <Button onClick={handleReset} value="reset" />
          <span>keyboard?</span>
        </div>
        <div>
          <h1 className="text-2xl">{gameStatus}</h1>
        </div>
      </div>
    </>
  );
}
