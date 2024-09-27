const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Определяем папки для статических файлов
const publicPath = path.join(__dirname, '../../../public');
const scriptsPath = path.join(__dirname, '../../scripts');
const cssPath = path.join(__dirname, '../../css');
const routerPath = path.join(__dirname, './');
const cookiePath = path.join(__dirname, '../cookie');
const imgPath = path.join(__dirname, '../../assets/img');

// Используем middleware для статики
app.use(express.static(publicPath));
app.use('/src/css', express.static(cssPath));

// Универсальный обработчик маршрутов для скриптов
app.get('/src/scripts/*', (req, res) => {
    const filePath = path.join(scriptsPath, req.params[0]); // динамически вычисляем путь к файлу
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('<h1>error Not Found</h1>');
        }
    });
});

// Универсальный обработчик маршрутов для картинок
app.get('/src/assets/img/*', (req, res) => {
    const filePath = path.join(imgPath, req.params[0]); // динамически вычисляем путь к файлу
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('<h1>error Not Found</h1>');
        }
    });
});

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Добавляем обработчик, который перехватывает любые запросы, кроме статических файлов
app.get('/*', (req, res) => {
    const extension = path.extname(req.url);

    // Проверяем наличие расширения в URL, если есть — это файл, и обрабатываем его как обычный запрос
    if (!extension) {
        // Если это не файл (нет расширения), отправляем index.html
        res.sendFile(path.join(publicPath, 'index.html'));
    } else {
        switch (req.url) {
            case '/src/services/router/router.js':
                res.sendFile(path.join(routerPath, '../router/router.js'));
                break;
            case '/src/services/cookie/cookie.js':
                res.sendFile(path.join(cookiePath, '../cookie/cookie.js'));
                break;
            case '/src/services/router/settings.js':
                res.sendFile(path.join(cookiePath, '../router/settings.js'));
                break;
            case '/src/services/client/auth/auth.js':
                res.sendFile(path.join(cookiePath, '../client/auth/auth.js'));
                break;
            default:
                // Если это файл, возвращаем error (если файл не найден)
                res.status(404).send('<h1>error Not Found</h1>');
        }
    }
});

// Запуск сервера на указанном порту
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
