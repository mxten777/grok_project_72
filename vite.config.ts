import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 관련 라이브러리
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Firebase 관련
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          // UI 라이브러리
          'ui-vendor': ['lucide-react', 'framer-motion', 'react-hot-toast', 'recharts'],
          // 유틸리티
          'utils-vendor': ['clsx', 'date-fns', 'tailwind-merge'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // 경고 임계값 조정
    minify: 'esbuild', // terser 대신 esbuild 사용
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
  },
})
