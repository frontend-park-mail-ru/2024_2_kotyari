import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import string from 'vite-plugin-string';
import fs from 'fs';
import path from 'path';

// Функция для поиска всех файлов .hbs во вложенных папках
function findHandlebarsTemplates(dir) {
  const templates = {};

  function scanDirectory(directory) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      const fullPath = path.resolve(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Если это папка, сканируем её рекурсивно
        scanDirectory(fullPath);
      } else if (stat.isFile() && file.endsWith('.hbs')) {
        const relativePath = path.relative(dir, fullPath);
        const templateName = relativePath.replace(/\\/g, '/').replace('.hbs', '');
        templates[templateName] = fullPath;
      }
    });
  }

  scanDirectory(dir);
  return templates;
}

// Поиск всех шаблонов Handlebars во вложенных папках src
const templates = findHandlebarsTemplates(path.resolve(__dirname, 'src/scripts'));

export default defineConfig({
  plugins: [
    string({ include: '**/*.hbs' }), // Добавляем поддержку импорта файлов .hbs как строк
    handlebars({
      partialDirectory: path.resolve(__dirname, 'src/scripts'),
    }),
    VitePWA({
      registerType: 'autoUpdate',
    }),
  ],
  build: {
    outDir: './dist/',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'), // Явно указываем index.html
        ...templates, // Добавляем все найденные шаблоны
      },
      external: [resolve(__dirname, 'services/app/app.ts')],
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
