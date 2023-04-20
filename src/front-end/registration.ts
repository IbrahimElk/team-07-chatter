/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */ //FIXME:
import { ClientLogin } from './client-dispatcher/client-login-logic.js';
// import { ws } from '../../client-dispatcher/main.js';
import { ClientUser } from './client-dispatcher/client-user.js';
import { wsClient } from './main.js';
console.log('REGISTRATION.TS');
console.log(wsClient.readyState);
console.log(wsClient.url);
console.log(wsClient);

const Id_of_HTML_tags = {
  id_input_username_reg: `register-username`,
  id_input_password_reg: `password-register`,
};

const registerButton = document.getElementById('register-button') as HTMLInputElement;
const showPasswordButton = document.getElementById('toggle-password-register') as HTMLElement;
const username = document.getElementById(Id_of_HTML_tags.id_input_username_reg) as HTMLInputElement;
const password = document.getElementById(Id_of_HTML_tags.id_input_password_reg) as HTMLInputElement;

registerButton.addEventListener('click', (event) => {
  event.preventDefault();
  const passwordValue = password.value;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  if (!passwordRegex.test(passwordValue)) {
    alert(
      'Password must have at least 8 characters, one uppercase letter, one lowercase letter, and one special character'
    );
    return;
  } else {
    ClientLogin.registration(wsClient, document);
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
