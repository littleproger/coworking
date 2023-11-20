import { useState, useCallback, useRef, useEffect } from 'react';

type QueryResult<T> = {
  data: T[] | null; // Assuming the data is an array
  error: Error | null;
  isLoading: boolean;
  refetch: () => void;
};

type QueryFunction<T> = () => Promise<T[]>;
type QueryFunctionListener<T> = (updateFn: (newData: T) => void) => () => void;

export const useQuery = <T>(
  queryFn: QueryFunction<T>,
  queryFnListener?: QueryFunctionListener<T>, // Optional listener function
): QueryResult<T> => {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchCountRef = useRef(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const fetchCount = ++fetchCountRef.current;

    try {
      const result = await queryFn();
      if (fetchCount === fetchCountRef.current) {
        setData(result);
      }
    } catch (err) {
      if (fetchCount === fetchCountRef.current) {
        setError(err as Error);
      }
    } finally {
      if (fetchCount === fetchCountRef.current) {
        setIsLoading(false);
      }
    }
  }, [queryFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (queryFnListener) {
      const unsubscribe = queryFnListener(newData => {
        setData(prevData => {
          // Assuming the data is an array and you want to append new data
          return prevData ? [...prevData, newData] : [newData];
        });
      });

      return unsubscribe; // Return the cleanup function
    }
  }, [queryFnListener]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch };
};
