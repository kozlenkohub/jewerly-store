import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },

  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: '/', // Важно для корректной работы маршрутов
  build: {
    outDir: 'dist', // Папка для сборки
  },
});
