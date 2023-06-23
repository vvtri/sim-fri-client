import { useEffect, useState } from 'react';

export const useDebounce = (value: any, debounceTime: number = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [value, debounceTime]);

  return debouncedValue;
};
