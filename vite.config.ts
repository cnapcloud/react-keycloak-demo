import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { ProxyOptions } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://kong-httpbin.cnap.dev', // 백엔드 서버 주소
        changeOrigin: true,
        secure: false,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
      } as ProxyOptions,
    },
  },  
})
