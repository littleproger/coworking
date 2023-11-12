import { useState, useCallback, useRef, useEffect } from 'react';

type QueryResult<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  refetch: () => void; // Add a refetch function to the return type
};

type QueryFunction<T> = () => Promise<T>;

export const useQuery = <T>(queryFn: QueryFunction<T>): QueryResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchCountRef = useRef(0); // Use a ref to track fetch count

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const fetchCount = ++fetchCountRef.current; // Increment fetch count

    try {
      const result = await queryFn();
      // Only update state if fetch count matches current count (latest fetch)
      if (fetchCount === fetchCountRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      // Only update state if fetch count matches current count (latest fetch)
      if (fetchCount === fetchCountRef.current) {
        setError(err as Error);
      }
    } finally {
      // Only update loading state if fetch count matches current count (latest fetch)
      if (fetchCount === fetchCountRef.current) {
        setIsLoading(false);
      }
    }
  }, [queryFn]);

  useEffect(() => {
    fetchData(); // Fetch data on mount and when queryFn changes
  }, [fetchData]);

  // Use a callback to return a stable reference to the refetch function
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch };
};
