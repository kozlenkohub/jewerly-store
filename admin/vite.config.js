import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 5174,
  },
  base: '/', // Важно для корректной работы маршрутов
  build: {
    outDir: 'dist', // Папка для сборки
  },
});
