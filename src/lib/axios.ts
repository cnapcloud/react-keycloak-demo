import axios from 'axios';
import { getEnv } from '@/config/env';
import keycloak from '@/lib/keycloak';

const apiClient = axios.create({
  baseURL: getEnv().API_BASE_URL,
  timeout: 3000,
});

apiClient.interceptors.request.use(async (config) => {
  try {
    await keycloak.updateToken(5);
  } catch {
    // 토큰 갱신 실패 시 현재 토큰으로 진행
  }
  const token = keycloak.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    const isTimeout =
      typeof error === 'object' &&
      error !== null &&
      (('code' in error && (error as { code: string }).code === 'ECONNABORTED') ||
        ('message' in error &&
          typeof (error as { message: unknown }).message === 'string' &&
          (error as { message: string }).message.includes('timeout')));

    if (isTimeout) {
      return Promise.reject(new Error('요청 시간이 초과되었습니다 (3초). 서버 상태를 확인해 주세요.'));
    }
    return Promise.reject(error);
  },
);

export default apiClient;
