const React = require('react');
const Layout = require('./Layout');

module.exports = function Main({ user }) {
  return (
    <Layout user={user}>
      <script defer src="/js/websocket_main.js" />

      <div className="chat">
        <div className="chat-container">

          <div className="chat-name">
            Главный чат
          </div>

          <div className="chat-content">

            <div className="online-list">
              <div className="chat-info">
                Сейчас онлайн
                <br />
                в главном чате:
              </div>
              <div className="user-list" id="usersName" />
            </div>

            <div className="main-chat-messege">
              <div className="chat-info">Написать сообщение в главный чат:</div>
              <form name="chatForm">
                <input name="chatInp" type="text" placeholder="Введите сообщение..." required />
                <button type="submit">Отправить</button>
              </form>
              <div className="chat-messege" id="chatMessages" />
            </div>

            <div className="wait-list">
              <div className="chat-info">
                Сейчас
                <br />
                меня ожидают:
              </div>
              <div className="user-list" id="myLinks" />
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
};
