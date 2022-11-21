const React = require('react');
const Layout = require('./Layout');

module.exports = function Room({ user, firstUserData, secondUserData }) {
  return (
    <Layout user={user}>
      <script defer src="/js/websocket_room.js" />
      <link rel="stylesheet" href="/css/room.css" />

      <div className="chat">
        <div className="chat-container">

          <div className="chat-name finger">
            BINNARY BATTLE
          </div>

          <div className="room-users">
            <span id="firstUser" data-user-id={firstUserData.id} data-user-name={firstUserData.name}>
              {' '}
              &laquo;
              <span className="finger">O</span>
              &raquo; &mdash;
              {' '}
              {firstUserData.name}
            </span>
            {' '}
            <span className="finger">VS</span>
            {' '}
            <span id="secondUser" data-user-id={secondUserData.id} data-user-name={secondUserData.name}>
              &laquo;
              <span className="finger">1</span>
              &raquo; &mdash;
              {' '}
              {secondUserData.name}
            </span>
          </div>

          <div className="game-content">
            <div className="main-game">

              <div className="game-info">
                <p className="game-score">
                  <span>Счёт игры:</span>
                  &ensp;&#91;&ensp;&laquo;
                  <span className="finger">O</span>
                  &raquo;&ensp;&mdash;&ensp;
                  <span id="firstUserPoints">0</span>
                  &ensp;||&ensp;&laquo;
                  <span className="finger">1</span>
                  &raquo;&ensp;&mdash;&ensp;
                  <span id="secondUserPoints">0</span>
                  &ensp;&#93;
                </p>
                <p>Статус игры:</p>
                <p id="gameInfoText" className="game-info-text">
                  ходит &laquo;
                  <span id="currentFigureName" className="finger">O</span>
                  &raquo; &#40;&ensp;
                  <span id="currentUserName">{firstUserData.name}</span>
                  &ensp;&#41;
                </p>
              </div>

              <div className="game-block">
                <div id="0" className="small-game non-active">
                  <div id="0-0" className="cell" />
                  <div id="0-1" className="cell" />
                  <div id="0-2" className="cell" />
                  <div id="0-3" className="cell" />
                  <div id="0-4" className="cell" />
                  <div id="0-5" className="cell" />
                  <div id="0-6" className="cell" />
                  <div id="0-7" className="cell" />
                  <div id="0-8" className="cell" />
                </div>
                <div id="1" className="small-game non-active">
                  <div id="1-0" className="cell" />
                  <div id="1-1" className="cell" />
                  <div id="1-2" className="cell" />
                  <div id="1-3" className="cell" />
                  <div id="1-4" className="cell" />
                  <div id="1-5" className="cell" />
                  <div id="1-6" className="cell" />
                  <div id="1-7" className="cell" />
                  <div id="1-8" className="cell" />
                </div>
                <div id="2" className="small-game non-active">
                  <div id="2-0" className="cell" />
                  <div id="2-1" className="cell" />
                  <div id="2-2" className="cell" />
                  <div id="2-3" className="cell" />
                  <div id="2-4" className="cell" />
                  <div id="2-5" className="cell" />
                  <div id="2-6" className="cell" />
                  <div id="2-7" className="cell" />
                  <div id="2-8" className="cell" />
                </div>
                <div id="3" className="small-game non-active">
                  <div id="3-0" className="cell" />
                  <div id="3-1" className="cell" />
                  <div id="3-2" className="cell" />
                  <div id="3-3" className="cell" />
                  <div id="3-4" className="cell" />
                  <div id="3-5" className="cell" />
                  <div id="3-6" className="cell" />
                  <div id="3-7" className="cell" />
                  <div id="3-8" className="cell" />
                </div>
                <div id="4" className="small-game">
                  <div id="4-0" className="cell" />
                  <div id="4-1" className="cell" />
                  <div id="4-2" className="cell" />
                  <div id="4-3" className="cell" />
                  <div id="4-4" className="cell" />
                  <div id="4-5" className="cell" />
                  <div id="4-6" className="cell" />
                  <div id="4-7" className="cell" />
                  <div id="4-8" className="cell" />
                </div>
                <div id="5" className="small-game non-active">
                  <div id="5-0" className="cell" />
                  <div id="5-1" className="cell" />
                  <div id="5-2" className="cell" />
                  <div id="5-3" className="cell" />
                  <div id="5-4" className="cell" />
                  <div id="5-5" className="cell" />
                  <div id="5-6" className="cell" />
                  <div id="5-7" className="cell" />
                  <div id="5-8" className="cell" />
                </div>
                <div id="6" className="small-game non-active">
                  <div id="6-0" className="cell" />
                  <div id="6-1" className="cell" />
                  <div id="6-2" className="cell" />
                  <div id="6-3" className="cell" />
                  <div id="6-4" className="cell" />
                  <div id="6-5" className="cell" />
                  <div id="6-6" className="cell" />
                  <div id="6-7" className="cell" />
                  <div id="6-8" className="cell" />
                </div>
                <div id="7" className="small-game non-active">
                  <div id="7-0" className="cell" />
                  <div id="7-1" className="cell" />
                  <div id="7-2" className="cell" />
                  <div id="7-3" className="cell" />
                  <div id="7-4" className="cell" />
                  <div id="7-5" className="cell" />
                  <div id="7-6" className="cell" />
                  <div id="7-7" className="cell" />
                  <div id="7-8" className="cell" />
                </div>
                <div id="8" className="small-game non-active">
                  <div id="8-0" className="cell" />
                  <div id="8-1" className="cell" />
                  <div id="8-2" className="cell" />
                  <div id="8-3" className="cell" />
                  <div id="8-4" className="cell" />
                  <div id="8-5" className="cell" />
                  <div id="8-6" className="cell" />
                  <div id="8-7" className="cell" />
                  <div id="8-8" className="cell" />
                </div>
              </div>

            </div>
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
