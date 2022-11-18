const React = require('react');
const Layout = require('./Layout');

module.exports = function Room({ user, firstUserData, secondUserData }) {
  return (
    <Layout user={user}>
      <script defer src="/js/websocket_room.js" />

      <div className="chat">
        <div className="chat-container">

          <div className="chat-name">
            Персональный чат
          </div>

          <div className="room-lable">
            для пользователей:
          </div>

          <div className="room-users">
            <span id="firstUser" data-user-name={firstUserData.name}>{firstUserData.name}</span>
            {' '}
            и
            {' '}
            <span id="secondUser" data-user-name={secondUserData.name}>{secondUserData.name}</span>
          </div>

          <div className="chat-content">
            <div className="main-chat-messege room">
              <div className="chat-info">Написать сообщение в персональный чат:</div>
              <form name="chatForm">
                <input name="chatInp" type="text" placeholder="Введите сообщение..." required />
                <button type="submit">Отправить</button>
              </form>
              <div className="chat-messege" id="chatMessages" />
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};
