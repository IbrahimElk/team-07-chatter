const passwordInputRegister = document.getElementById('password-register') as HTMLInputElement;
const registerButton = document.getElementById('register-button') as HTMLInputElement;

registerButton.addEventListener('click', (event) => {
  event.preventDefault();

  const passwordValue = passwordInputRegister.value;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  if (!passwordRegex.test(passwordValue)) {
    alert(
      'Password must have at least 8 characters, one uppercase letter, one lowercase letter, and one special character'
    );
    return;
  }

  window.location.href = 'home.html';
});
