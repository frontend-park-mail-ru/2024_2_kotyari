import express from 'express';
import { fileURLToPath } from 'url';

import path from 'path';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, '../public');
const cssPath = path.join(__dirname, '../src/css');
const imgPath = path.join(__dirname, '../src/assets');

const basePath = path.join(__dirname, '../');
// Используем middleware для статики

app.use(express.static(path.join(__dirname, 'dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
  });
}


app.use(express.static(imgPath));
app.use(express.static(publicPath));
app.use(express.static(cssPath));

app.get('/dist/scripts/*', (req, res) => {
  const filePath = path.join(distPath, req.params[0]); // Динамически вычисляем путь к файлу
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('<h1>error Not Found</h1>');
    }
  });
});

/**
 * Универсальный обработчик маршрутов для изображений.
 * Отправляет запрашиваемые файлы изображений из папки assets.
 * Если файл не найден, возвращает 404 ошибку.
 *
 * @param {Object} req - Объект запроса
 * @param {Object} res - Объект ответа
 */
app.get('/src/assets/*', (req, res) => {
  const filePath = path.join(imgPath, req.params[0]); // Динамически вычисляем путь к файлу
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('<h1>error Not Found</h1>');
    }
  });
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/error/index.css', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.css'));
});

/**
 * Обработчик для перехвата любых запросов, кроме статических файлов.
 * Если в запросе нет расширения, отправляет файл index.html.
 * Если запрашивается определённый файл, возвращает его.
 * В противном случае возвращает 404 ошибку.
 *
 * @param {Object} req - Объект запроса
 * @param {Object} res - Объект ответа
 */
app.get('/*', (req, res) => {
  const extension = path.extname(req.url);

  // Проверяем наличие расширения в URL
  if (!extension) {
    // Если это не файл (нет расширения), отправляем index.html
    res.sendFile(path.join(publicPath, 'index.html'));
  } else {
    res.sendFile(path.join(basePath, req.url));
  }
});

/**
 * Маршрут для главной страницы.
 * Отправляет файл index.html из папки public.
 *
 * @param {Object} req - Объект запроса
 * @param {Object} res - Объект ответа
 */

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

/**
 * Запуск сервера на указанном порту.
 *
 * @param {number} PORT - Порт, на котором будет запущен сервер
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
