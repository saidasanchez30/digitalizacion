import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for GET requests that load on mount.
 * @param {Function} apiFn  - API function to call (must return a promise)
 * @param {Array}    deps   - Extra dependencies that re-trigger the call when changed
 */
export function useApiGet(apiFn, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn();
      setData(res.data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}

/**
 * Hook for manual mutations (POST / PUT / PATCH / DELETE).
 * Returns an `execute` function and state flags.
 */
export function useApiMutation(apiFn) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await apiFn(...args);
      setData(res.data);
      setSuccess(true);
      return res.data;
    } catch (err) {
      const msg = extractError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setSuccess(false);
  }, []);

  return { data, loading, error, success, execute, reset };
}

function extractError(err) {
  if (err?.response?.data?.detail) {
    const detail = err.response.data.detail;
    return Array.isArray(detail)
      ? detail.map(d => d.msg).join(', ')
      : String(detail);
  }
  return err?.message || 'Ocurrió un error inesperado. Intenta de nuevo.';
}
