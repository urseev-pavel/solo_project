const React = require('react');

module.exports = function Layout({ user, children }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* <link rel="stylesheet" href="/css/styles.css" />
        <script defer src="/js/front.js" /> */}
        <title>SOLO</title>
      </head>

      <body>

        <nav className="navbar">
          <a href="/">Главная</a>

          {!user && (
            <>
              <a href="/login">
                Войти
              </a>
              <a href="/register">
                Зарегистрироваться
              </a>
            </>
          )}

          {user && (
            <>
              <p>{`Привет, ${user.name}!`}</p>
              <a href="/logout">
                Выйти
              </a>
            </>
          )}

        </nav>

        <main className="main">
          {children}
        </main>

      </body>
    </html>
  );
};
