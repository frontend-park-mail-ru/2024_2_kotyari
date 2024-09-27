import {templatize} from '../constprograms/shablon/shablon.js'
import { user } from '../../services/router/router.js';

export function buildBody(data) {
    return templatize(document.body, '/src/scripts/layouts/body.hbs', data).then(() => {
        handleLogout();
    });
}

export function handleLogout() {
    const logoutButton = document.getElementById('logout-button');

    if (logoutButton) {
        console.log("'Выход' найден, привязываем обработчик");
        logoutButton.addEventListener('click', async function(event) {
            // event.preventDefault();
            console.log('Клик по кнопке "Выход"');

            simulateLogoutUI();

            try {
                const response = await fetch('/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    console.log('Выход успешен, перенаправляем на главную страницу');
                    window.location.href = '/'; // Перенаправляем на главную страницу
                } else {
                    console.error('Ошибка при выходе:', response.status);
                    alert('Не удалось выполнить выход. Попробуйте снова.');
                }
            } catch (error) {
                console.error('Произошла ошибка сети.', error);
                alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
            }
        });
    } else {
        console.log("'Выход' не найден. Проверьте шаблон.");
    }
}

function simulateLogoutUI() {
    console.log('Обновляем интерфейс для неавторизованного пользователя...');

    delete user.name;
}
