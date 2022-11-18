const React = require('react');

module.exports = function Layout({ user, canvas, children }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/css/styles.css" />
        <title>Solo Project</title>
      </head>

      <body data-user-id={user?.userId}>

        {canvas && (
          <>
            <link rel="stylesheet" href="/css/canvas.css" />
            <script defer src="/js/canvas.js" />
            <canvas id="canvas1" />
          </>
        )}

        <nav className="navbar">

          {!user && (
            <div>
              <a href="/login">
                Войти
              </a>
              <a href="/register">
                Зарегистрироваться
              </a>
            </div>
          )}

          {user && (
            <div>
              <a href="/">Главный чат</a>
              <a href="/antistress">Антистресс</a>
              <p>{`Привет, ${user.userName}!`}</p>
              <a href="/logout">
                Выйти
              </a>
            </div>
          )}

        </nav>

        <main className="main">
          {children}
        </main>

      </body>
    </html>
  );
};
