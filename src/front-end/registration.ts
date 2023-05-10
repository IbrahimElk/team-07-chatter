import { ClientLogin } from './client-dispatcher/client-login-logic.js';
import { ClientUser } from './client-dispatcher/client-user.js';
import { id_tags_index, id_tags_register } from './id-tags.js';
import { client } from './main.js';

console.log('REGISTRATION.TS');

const registerButton = document.getElementById('register-button') as HTMLInputElement;
const showPasswordButton = document.getElementById('toggle-password-register') as HTMLElement;
const password = document.getElementById('password-register') as HTMLInputElement;
const username = document.getElementById(id_tags_register.input_username_reg) as HTMLInputElement;

password.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    registerButton.click();
  }
});

registerButton.addEventListener('click', (event) => {
  event.preventDefault();
  const usernameValue = username.value;
  const passwordValue = password.value;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,}$/;

  if (!passwordRegex.test(passwordValue)) {
    alert(
      'Password must have at least 8 characters, one uppercase letter, one lowercase letter, and one special character'
    );
    return;
  } else {
    console.log('laten we eens registreren');
    ClientLogin.registration(client, client.getWebSocket(), usernameValue, passwordValue);
  }
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
