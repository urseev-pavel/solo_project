const React = require('react');
const Layout = require('./Layout');

module.exports = function Login() {
  return (
    <Layout>
      <script defer src="/js/login.js" />
      <div className="auth">
        <h1>Войти</h1>
        <form name="loginForm">
          <input type="email" name="userEmail" placeholder="Введите email..." required />
          <input type="password" name="userPassword" placeholder="Введите  пароль..." required />
          <p className="errorBlock" />
          <button type="submit">Войти</button>
        </form>
      </div>
    </Layout>
  );
};
