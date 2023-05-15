import { useState, useMemo, useEffect, useRef } from "react";
import { ApiResult, CallResult } from "../types/index";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type Call<T> = () => Promise<ApiResult<T>>;

export function useCallsData<T>(
  fn: Call<T>,
  valid?: undefined | boolean,
  reload?: number | string | boolean
): CallResult<T> {
  const [result, setResult] = useState<ApiResult<T>>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fn && valid !== false) {
      setLoading(true);
      fn().then((result) => {
        setResult(result);
        setLoading(false);
      });
    }
  }, [fn, valid, reload]);

  return useMemo(
    () => ({
      result,
      loading,
    }),
    [result, loading]
  );
}

export function useLatestDataCall<T>(
  fn: Call<T>,
  valid?: undefined | boolean,
  reload?: number | string | boolean
): CallResult<T> {
  const [loading, setLoading] = useState(false);

  const indexRef = useRef<number>(0);
  const resultsRef = useRef<{ [key: string]: T | undefined }>({});

  useEffect(() => {
    if (fn && valid !== false) {
      setLoading(true);

      indexRef.current = indexRef.current + 1;
      let index = indexRef.current;

      fn().then((result) => {
        resultsRef.current = {
          ...resultsRef.current,
          [String(index)]: result as T,
        };

        setLoading(false);
      });
    }
  }, [fn, valid, reload]);

  return useMemo(() => {
    return {
      result: resultsRef.current[indexRef.current] as T | undefined,
      loading,
    };
    // eslint-disable-next-line
  }, [resultsRef.current, indexRef.current, loading]);
}
