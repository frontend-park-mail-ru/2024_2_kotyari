import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
export default defineConfig({
  plugins: [handlebars()],
  build: {
    outDir: './dist/',
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html'),
      external: [
        resolve(__dirname, 'services/app/new-app.ts'),
      ],
    },
  },
  server: {
    port: 3000, // Порт для dev-сервера
  },
  preview: {
    // host: '0.0.0.0',
    port: 3000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Правильное задание алиаса для пути
    },
  },
});
