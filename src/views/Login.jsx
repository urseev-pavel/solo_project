const React = require('react');
const Layout = require('./Layout');

module.exports = function Login() {
  return (
    <Layout>
      <script defer src="/js/login.js" />
      <div className="login">
        <h1>Вход</h1>

        <form name="loginForm">
          <input type="email" name="userEmail" placeholder="Email" required />
          <input type="password" name="userPassword" placeholder="Пароль" required />
          <button type="submit">Войти</button>
        </form>

        <p className="errorBlock" style={{ color: 'red' }} />

      </div>
    </Layout>
  );
};
