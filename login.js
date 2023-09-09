import { ClientLogin } from './client-dispatcher/client-login-logic.js';
import './client-dispatcher/client-user.js';
import { client } from './main.js';
const loginButton = document.getElementById('login-button');
const showPasswordButton = document.getElementById('toggle-password');
const usernameInput = document.getElementById(ClientLogin.Id_of_tags.input_username_login);
const passwordInput = document.getElementById(ClientLogin.Id_of_tags.input_password_login);
passwordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        loginButton.click();
    }
});
loginButton.addEventListener('click', (event) => {
    event.preventDefault();
    ClientLogin.login(client, client.getWebSocket(), usernameInput.value, passwordInput.value);
});
showPasswordButton.addEventListener('click', function () {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        // Change the eye-icon to an eye-icon with a slash
        showPasswordButton.innerHTML = '<i class="bi bi-eye-slash"></i>';
    }
    else {
        // It is text, so now you want to change it to password type.
        passwordInput.type = 'password';
        // Change the eye-icon with a slash to a normal eye-icon
        showPasswordButton.innerHTML = '<i class="bi bi-eye"></i>';
    }
});
//# sourceMappingURL=login.js.map