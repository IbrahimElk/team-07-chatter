const passwordInput = document.getElementById('password-register') as HTMLInputElement;
const showPasswordButton = document.getElementById('toggle-password-register');

if (showPasswordButton) {
  showPasswordButton.addEventListener('click', function () {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      // Change the eye-icon to an eye-icon with a slash
      showPasswordButton.innerHTML = '<i class="bi bi-eye-slash"></i>';
    } else {
      // It is text, so now you want to change it to password type.
      passwordInput.type = 'password';
      // Change the eye-icon with a slash to a normal eye-icon
      showPasswordButton.innerHTML = '<i class="bi bi-eye"></i>';
    }
  });
}
