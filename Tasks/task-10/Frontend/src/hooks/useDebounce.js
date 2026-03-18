import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a value.
 * Useful for performance-critical inputs.
 */
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Value ko tabhi update karo jab delay khatam ho jaye
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: Agar user ne type karna jaari rakha,
    // toh purana timer cancel kar do.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;