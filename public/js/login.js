const { loginForm } = document.forms;
// console.log(loginForm);

const errorBlock = document.querySelector('p.errorBlock');
// console.log(errorBlock);

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const loginFormResult = Object.fromEntries(new FormData(loginForm));
  // console.log(loginFormResult);

  errorBlock.innerHTML = '';

  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(loginFormResult),
  });
  // console.log(response);
  if (response.status === 200) {
    const { backResult } = await response.json();
    // console.log('===>', backResult);
    if (backResult === 'LOGIN-OK') {
      window.location.assign('/');
    }
    if (backResult === 'BAD-EMAIL') {
      errorBlock.innerHTML = `Введённый email <b>${loginFormResult.userEmail}</b> не зарегистрирован!`;
    }
    if (backResult === 'BAD-PASSWORD') {
      errorBlock.innerHTML = 'Введён <b>не верный</b> пароль!';
    }
  } else {
    console.log('!!! ОШИБКА НА СЕРВЕРЕ !!!');
  }
});
