const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Определяем папки для статических файлов
const publicPath = path.join(__dirname, '../../../public');
const scriptsPath = path.join(__dirname, '../../scripts');
const cssPath = path.join(__dirname, '../../css');

// Используем middleware для статики
app.use(express.static(publicPath));
app.use('/src/css', express.static(cssPath));

// Универсальный обработчик маршрутов для скриптов
app.get('/src/scripts/*', (req, res) => {
    const filePath = path.join(scriptsPath, req.params[0]);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('<h1>404 Not Found</h1>');
        }
    });
});

// Универсальный обработчик для других файлов в корне
app.get('/:file', (req, res) => {
    const filePath = path.join(publicPath, req.params.file);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('<h1>404 Not Found</h1>');
        }
    });
});

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Обработка 404 ошибки для всех остальных запросов
app.use((req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>');
});

// Запуск сервера на указанном порту
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
