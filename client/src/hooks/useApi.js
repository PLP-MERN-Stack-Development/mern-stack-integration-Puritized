import { useState, useCallback } from 'react';

export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (fn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(...args);
      setLoading(false);
      return res;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  return { loading, error, call, setError };
}