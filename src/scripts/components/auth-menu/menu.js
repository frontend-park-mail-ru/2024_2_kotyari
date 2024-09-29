import {templatize} from "../../constprograms/shablon/shablon.js";
import {menuSignUp} from "./menu-config.js";
import {handleSignUp} from "../../../services/client/auth/auth.js";

const tmpURL = 'src/scripts/components/auth-menu/menu.hbs'

// Функция для переключения типа input и состояния иконки
function togglePassword(event) {
    const icon = event.target;
    const fieldId = icon.getAttribute('data-field-id');
    const passwordInput = document.getElementById(fieldId);

    // Переключаем тип input (password <-> text)
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Меняем класс иконки (добавляем или убираем зачеркивание)
    if (type === 'text') {
        icon.classList.remove('eye-open');
        icon.classList.add('eye-closed');
    } else {
        icon.classList.remove('eye-closed');
        icon.classList.add('eye-open');
    }
}

export async function buildAuthMenu(data){
    return templatize(document.getElementById('main'), tmpURL, data).then(() => {
        // Назначаем обработчик события для всех иконок с классом 'toggle-password'
        document.querySelectorAll('.toggle-password').forEach(item => {
            item.addEventListener('click', togglePassword);
        });
    })
}
