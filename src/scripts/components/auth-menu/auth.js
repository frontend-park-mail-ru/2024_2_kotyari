/**
 * Validates the email field by checking if it matches the email format.
 * If invalid, displays an error message.
 *
 * @param {HTMLInputElement} email - The email input element to validate.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
export function validateEmail(email) {
  const emailRegex = /^[a-z0-9а-яё._%+-]+@[a-z0-9а-яё.-]+\.[a-zа-я]{2,}$/i;
  const errorElement = document.getElementById(email.dataset.errorId);

  removeInputError(email, errorElement);

  if (!emailRegex.test(email.value)) {
    addInputError(email, errorElement, 'Неверный формат почты.');

    return false;
  }

  return true;
}

/**
 * Removes error message from the input field and resets its style.
 *
 * @param {HTMLElement} element - The input element to clear error from.
 * @param {HTMLElement} errorElement - The element where the error message is displayed.
 */
function removeInputError(element, errorElement) {
  errorElement.textContent = '';
  element.classList.remove('invalid__input');
}

/**
 * Adds an error message to the input field and applies invalid input styling.
 *
 * @param {HTMLElement} element - The input element to apply the error message to.
 * @param {HTMLElement} errorElement - The element where the error message will be displayed.
 * @param {string} msg - The error message to display.
 */
function addInputError(element, errorElement, msg) {
  errorElement.textContent = msg;
  element.classList.add('invalid__input');
}

/**
 * Validates the password and its confirmation by checking for length, character complexity, and matching.
 * Displays an error message if any condition is not met.
 *
 * @param {HTMLInputElement} password - The password input element.
 * @param {HTMLInputElement} passwordRepeat - The password confirmation input element.
 * @returns {boolean} - Returns true if the password and confirmation are valid, otherwise false.
 */
export function validatePasswordMatch(password, passwordRepeat) {
    let isValid = true;
    const errorRepeatElement = document.getElementById(passwordRepeat.dataset.errorId);

    removeInputError(passwordRepeat, errorRepeatElement);
    const passwordValue = password.value
    const passwordRepeatValue = passwordRepeat.value
    if (passwordValue !== passwordRepeatValue || passwordValue === '' && passwordRepeatValue === '') {
        addInputError(passwordRepeat, errorRepeatElement, 'Пароли должны совпадать');
        isValid = false;
    } else {
        removeInputError(passwordRepeat, errorRepeatElement);
    }

    return isValid;
}

export function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&#])[A-Za-z\d!@#$%^:&?*.]{8,}$/;
        let isValid = true;
        const errorElement = document.getElementById(password.dataset.errorId);

        removeInputError(password, errorElement);

        if (!passwordRegex.test(password.value)) {
            let errorMsg;
            if (password.value.length < 8) {
                errorMsg = 'Пароль должен содержать не менее 8 символов.'
            } else {
                errorMsg = 'Пароль должен содержать заглавные, строчные буквы, цифру и специальный символ @$%*?&#.';
            }
            addInputError(password, errorElement, errorMsg);
            isValid = false;
        } else {
            removeInputError(password, errorElement);
        }

        return isValid;
}

/**
 * Validates the username by checking its length and allowed characters.
 * Displays an error message if invalid.
 *
 * @param {HTMLInputElement} username - The username input element to validate.
 * @returns {boolean} - Returns true if the username is valid, otherwise false.
 */
export function validateUsername(username) {
  const usernameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9 _-]+$/;
  let isValid = true;
  const errorElement = document.getElementById(username.dataset.errorId);
  const user = username.value;

  removeInputError(username, errorElement);

  if (user.length < 2 || user.length > 40) {
    addInputError(username, errorElement, 'Имя должно быть от 2 до 40 символов.');
    isValid = false;
  } else if (!usernameRegex.test(user)) {
    addInputError(username, errorElement, 'Имя может содержать буквы, цифры, пробелы, а также "-" и "_"');
    isValid = false;
  } else {
    removeInputError(username, errorElement);
  }

  return isValid;
}
