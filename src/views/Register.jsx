const React = require('react');
const Layout = require('./Layout');

module.exports = function Register() {
  return (
    <Layout>
      <script defer src="/js/register.js" />
      <div className="register">
        <h1>Регистрация</h1>

        <form name="registerForm">
          <input type="email" name="userEmail" placeholder="Email" required />
          <input type="text" name="userName" placeholder="Имя" required />
          <input type="password" name="userPassword" placeholder="Пароль" required />
          <input type="password" name="userRepeatPassword" placeholder="Повторите пароль" required />
          <button type="submit">Зарегистрироваться</button>
        </form>

        <p className="errorBlock" style={{ color: 'red' }} />

      </div>
    </Layout>
  );
};
