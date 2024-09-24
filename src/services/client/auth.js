import {validateUsername, validatePassword, validateEmail} from "../../scripts/components/modalAuth";
import {modalSignIn, modalSignUp} from "../../scripts/components/modalData";


function handleSignIn(event) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Валидация полей
    if (!(validateEmail(email) && validatePassword(password))) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }

    this.classList.add('was-validated');
    event.preventDefault();

    fetch('/login', {
        method: 'POST',
        body: JSON.stringify({
            email: email.value,
            password: password.value
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // Удаление листенера после отправки формы
                document.getElementById(modalSignIn.formId).removeEventListener('submit', handleSignIn);
            } else {
                console.error('Login failed');
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
        });
}

document.getElementById(modalSignIn.formId).addEventListener('submit', handleSignIn);

function handleSignUp(event) {
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    if (!(validateUsername(username) && validateEmail(email) && validatePassword(password)) ) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }

    this.classList.add('was-validated');
    event.preventDefault();

    fetch('/signup', {
        method: 'POST',
        body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                document.getElementById(modalSignUp.formId).removeEventListener('submit', handleSignUp);
            } else {
                console.error('Registration failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error during registration:', error);
        });
}

document.getElementById(modalSignUp.formId).addEventListener('submit', handleSignUp);
