const React = require('react');
const Layout = require('./Layout');

module.exports = function Register() {
  return (
    <Layout>
      <script defer src="/js/register.js" />
      <div className="auth">
        <h1>Регистрация</h1>
        <form name="registerForm">
          <input type="email" name="userEmail" placeholder="Введите email..." required />
          <input type="text" name="userName" placeholder="Введите имя..." required />
          <input type="password" name="userPassword" placeholder="Введите  пароль..." required />
          <input type="password" name="userRepeatPassword" placeholder="Повторите пароль..." required />
          <p className="errorBlock" />
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </Layout>
  );
};
