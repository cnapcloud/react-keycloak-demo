import { useState } from 'react';
import type { ApiCallState } from '@/types';
import apiClient from '@/lib/axios';

interface UseApiCallReturn extends ApiCallState {
  call: (path: string) => Promise<void>;
}

export function useApiCall(): UseApiCallReturn {
  const [state, setState] = useState<ApiCallState>({
    data: null,
    status: null,
    duration: null,
    loading: false,
    error: null,
  });

  const call = async (path: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const start = Date.now();
    try {
      const { data, status } = await apiClient.get<unknown>(path);
      setState({ data, status, duration: Date.now() - start, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : '요청 실패';
      setState({ data: null, status: null, duration: Date.now() - start, loading: false, error: message });
    }
  };

  return { ...state, call };
}
