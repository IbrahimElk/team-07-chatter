import { ClientLogin } from './client-dispatcher/client-login-logic.js';
import { wsClient } from './main.js';

console.log('LOGIN.TS');

const Id_of_HTML_tags = {
  id_input_username_login: `sign-in-username`,
  id_input_password_login: `password`,
};

const loginButton = document.getElementById('login-button') as HTMLButtonElement;
const showPasswordButton = document.getElementById('toggle-password') as HTMLElement;
const password = document.getElementById(Id_of_HTML_tags.id_input_password_login) as HTMLInputElement;

loginButton.addEventListener('click', (event) => {
  event.preventDefault();
  ClientLogin.login(wsClient, document);
});

showPasswordButton.addEventListener('click', function () {
  if (password.type === 'password') {
    password.type = 'text';
    // Change the eye-icon to an eye-icon with a slash
    showPasswordButton.innerHTML = '<i class="bi bi-eye-slash"></i>';
  } else {
    // It is text, so now you want to change it to password type.
    password.type = 'password';
    // Change the eye-icon with a slash to a normal eye-icon
    showPasswordButton.innerHTML = '<i class="bi bi-eye"></i>';
  }
});
