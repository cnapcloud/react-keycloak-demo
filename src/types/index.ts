export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface ApiCallState {
  data: unknown;
  status: number | null;
  duration: number | null;
  loading: boolean;
  error: string | null;
}
