const { registerForm } = document.forms;
// console.log(registerForm);

const errorBlock = document.querySelector('p.errorBlock');
// console.log(errorBlock);

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const registerFormResult = Object.fromEntries(new FormData(registerForm));
  // console.log(registerFormResult);

  if (registerFormResult.userPassword !== registerFormResult.userRepeatPassword) {
    errorBlock.innerHTML = 'Пароль <b>не совпадает</b> с повторно введённым паролем!';
  } else {
    errorBlock.innerHTML = '';
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(registerFormResult),
    });
    // console.log(response);
    if (response.status === 200) {
      const { backResult } = await response.json();
      // console.log('===>', backResult);
      if (backResult === 'REGISTER-OK') {
        window.location.assign('/');
      }
      if (backResult === 'NEED-NEW-EMAIL') {
        errorBlock.innerHTML = `Пользователь с email <b>${registerFormResult.userEmail}</b> уже существует!`;
      }
    } else {
      console.log('!!! ОШИБКА НА СЕРВЕРЕ !!!');
      errorBlock.innerHTML = '!!! ОШИБКА НА СЕРВЕРЕ !!!';
    }
  }
});
