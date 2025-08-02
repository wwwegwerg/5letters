import React, { useCallback, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValueRaw] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      console.warn(e);
      return initialValue;
    }
  });
  const setStoredValue = useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (value) => {
      setStoredValueRaw((prev) => {
        const valueToStore =
          typeof value === "function"
            ? (value as (prevState: T) => T)(prev)
            : value;
        try {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (e) {
          console.warn(e);
        }
        return valueToStore;
      });
    },
    [key],
  );
  return [storedValue, setStoredValue];
}
