const http = require('http');
const debug = require('debug')('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Определяем MIME-типы для файлов
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const { url } = req;

    let filePath = ''
    if (url === '/') {
        filePath = '../../../public/index.html'
    } else {
        if (url === '/src/scripts/layouts/body.js') {
            filePath = '../../scripts/layouts/body.js'
        }
        if (url === '/src/scripts/components/elements.js' || url === '/src/scripts/components/elements') {
            filePath = '../../scripts/components/elements.js'
        }
        if (url === '/src/scripts/components/buildcomponents.js' || url === '/src/scripts/components/buildcomponents') {
            filePath = '../../scripts/components/buildcomponents.js'
        }
        if (url === '/src/css/basic.css') {
            filePath = '../../css/basic.css'
        }
        if (url === '/src/scripts/components/components') {
            filePath = '../../scripts/components/components.js'
        }
        if (url === '/src/scripts/errors/errors') {
            filePath = '../../scripts/errors/errors.js'
        }
    }



    // Проверяем расширение файла для правильного MIME-типа
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Читаем файл и отправляем его в ответ
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }

        // Отправляем данные с корректным MIME-типом
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

// Запуск сервера на указанном порту
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
