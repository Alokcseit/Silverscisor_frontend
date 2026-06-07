import { useState, useEffect, useRef, useCallback } from 'react';
// Reusable API hook with configurable options
// Usage:
// const { data, error, loading, status, call } = useApi({ baseURL, url, method, params, body, headers, auto, auth, onSuccess, onError })

const buildUrl = (baseURL = '', url = '', params = {}) => {
  const full = baseURL ? `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}` : url;
  const keys = Object.keys(params || {});
  if (!keys.length) return full;
  const query = keys
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
  return `${full}${full.includes('?') ? '&' : '?'}${query}`;
};

export default function useApi(options = {}) {
  const {
    baseURL = '',
    url = '',
    method = 'GET',
    params = null,
    body = null,
    headers = {},
    auto = false,
    auth = true,
    dependencies = [],
    onSuccess = () => {},
    onError = () => {}
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const abortRef = useRef(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('silverscissor_token') : null;

  const call = useCallback(
    async (override = {}) => {
      const finalUrl = buildUrl(override.baseURL ?? baseURL, override.url ?? url, override.params ?? params);
      const finalMethod = (override.method ?? method).toUpperCase();
      const finalBody = override.body ?? body;
      const finalHeaders = { ...(headers || {}), ...(override.headers || {}) };

      if (auth && token) {
        finalHeaders['Authorization'] = `Bearer ${token}`;
      }

      if (finalBody && !(finalBody instanceof FormData) && !finalHeaders['Content-Type']) {
        finalHeaders['Content-Type'] = 'application/json';
      }

      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);
      setStatus(null);

      try {
        const res = await fetch(finalUrl, {
          method: finalMethod,
          headers: finalHeaders,
          body: finalBody && !(finalBody instanceof FormData) ? JSON.stringify(finalBody) : finalBody,
          signal: abortRef.current.signal
        });

        setStatus(res.status);

        const contentType = res.headers.get('content-type') || '';
        let parsed = null;
        if (contentType.includes('application/json')) {
          parsed = await res.json();
        } else {
          parsed = await res.text();
        }

        if (!res.ok) {
          const err = new Error(parsed?.message || `Request failed with status ${res.status}`);
          err.status = res.status;
          err.payload = parsed;
          setError(err);
          onError(err);
          return { error: err, status: res.status };
        }

        setData(parsed);
        onSuccess(parsed);
        return { data: parsed, status: res.status };
      } catch (err) {
        if (err.name === 'AbortError') return { aborted: true };
        setError(err);
        onError(err);
        return { error: err };
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseURL, url, method, JSON.stringify(params || {}), JSON.stringify(body || {}), token, ...dependencies]
  );

  useEffect(() => {
    if (auto && url) {
      call();
    }
    return () => abortRef.current && abortRef.current.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, url, call]);

  return { data, error, loading, status, call };
}
