const socket = new WebSocket(window.location.href.replace(/^http/, 'ws'));

const { userId } = document.querySelector('body').dataset;
// console.log('userId ===>', userId);

const pathname = window.location.pathname.split('/');
const roomNumber = `${pathname[pathname.length - 2]}-${pathname[pathname.length - 1]}`;
// console.log('roomNumber ===>', roomNumber);

const { chatForm } = document.forms;

const chatMessagesDiv = document.querySelector('#chatMessages');

const firstUserSpan = document.querySelector('#firstUser');
const firstUserName = firstUserSpan.dataset.userName;
const firstUserId = firstUserSpan.dataset.userId;
const secondUserSpan = document.querySelector('#secondUser');
const secondUserName = secondUserSpan.dataset.userName;
const secondUserId = secondUserSpan.dataset.userId;
// console.log('===>', {
//   firstUserName, firstUserId, secondUserName, secondUserId,
// });

const gameBlock = document.querySelector('.game-block');

let currentFigureName = document.querySelector('#currentFigureName');
let currentUserName = document.querySelector('#currentUserName');
// console.log('===> ', { currentFigureName, currentUserName });

const firstUserPoints = document.querySelector('#firstUserPoints');
const secondUserPoints = document.querySelector('#secondUserPoints');
// console.log('===> ', { firstUserPoints, secondUserPoints });

const gameInfoText = document.querySelector('#gameInfoText');
// console.log('===> ', { gameInfoText });

function usersRoomStatusUpdate(payload) {
  const thisRoomData = payload.usersMapData.filter((el) => el.userStatus === `room-${roomNumber}`);
  // console.log('thisRoomData ===>', thisRoomData);
  // eslint-disable-next-line no-unused-expressions
  thisRoomData.filter((el) => el.userName === firstUserName).length > 0 ? firstUserSpan.className = 'online' : firstUserSpan.className = 'offline';
  // eslint-disable-next-line no-unused-expressions
  thisRoomData.filter((el) => el.userName === secondUserName).length > 0 ? secondUserSpan.className = 'online' : secondUserSpan.className = 'offline';
}

function addNewMessage(payload) {
  const newMessege = document.createElement('p');
  newMessege.innerHTML = `<b>${payload.userName}: </b>${payload.value} <span>&#91;${(new Date()).toLocaleString()}&#93;</span>`;
  if (+userId === payload.userId) {
    newMessege.classList.add('my');
  }
  chatMessagesDiv.insertAdjacentElement('afterbegin', newMessege);
}

// #################################################

function moveCounter(gameArrayData) {
  return gameArrayData.gameArray.map((el) => el.filter((subEl) => subEl !== null).length).reduce((acc, curr) => acc + curr, 0);
}

function whoMoveId(gameArrayData) {
  return moveCounter(gameArrayData) % 2 === 0 ? +firstUserId : +secondUserId;
}

function checkSmallGame(smallGameArr) {
  const result = { smallGameStatus: 'open', smallGameWinCells: [] };
  if (smallGameArr.filter((el) => el !== null).length === 9) {
    result.smallGameStatus = 'draw';
  }
  const winCellsArr = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  winCellsArr.forEach((el) => {
    if (smallGameArr[el[0]] !== null
      && smallGameArr[el[0]] === smallGameArr[el[1]]
      && smallGameArr[el[1]] === smallGameArr[el[2]]) {
      result.smallGameStatus = smallGameArr[el[0]];
      result.smallGameWinCells.push(...el);
    }
  });
  return result;
}

function getGameStatus(gameArrayData) {
  return gameArrayData.gameArray.map((el, index) => ({ smallGameId: index, ...checkSmallGame(el) }));
}

function renderGameBlock(gameArrayData) {
  const gameStatus = getGameStatus(gameArrayData);
  console.log('gameStatus ===>', gameStatus);
  const { activeSmallGames } = gameArrayData;
  console.log('activeSmallGames ===>', activeSmallGames);
  const checkSmallGameIndex = (smallGameIndex) => activeSmallGames.indexOf(smallGameIndex) >= 0;
  const getSmallGameWinCells = (smallGameIndex) => gameStatus.filter((el) => el.smallGameId === smallGameIndex)[0].smallGameWinCells;
  const checkCellIndex = (smallGameIndex, cellIndex) => getSmallGameWinCells(smallGameIndex).indexOf(cellIndex) >= 0;

  gameBlock.innerHTML = `
    ${gameArrayData.gameArray.map((el, index) => (`
      <div id="${index}" class="small-game ${checkSmallGameIndex(index) ? '' : 'non-active'}">
      ${el.map((subEl, subIndex) => (`
        <div id="${index}-${subIndex}" class="cell ${subEl !== null && checkSmallGameIndex(index) ? 'non-active' : ''}${subEl === null && checkSmallGameIndex(index) && whoMoveId(gameArrayData) === +userId ? 'active' : ''}${subEl !== null && !checkSmallGameIndex(index) && checkCellIndex(index, subIndex) ? 'win' : ''}">
        ${subEl === null ? '' : subEl}
        </div>
      `)).join('')}
      </div>
    `)).join('')}
  `;
}

function renderGameInfo(gameArrayData) {
  const gameStatus = getGameStatus(gameArrayData);
  console.log('gameStatus ===>', gameStatus);
  const firstUserPointsValue = gameStatus.filter((el) => el.smallGameStatus === 'O').length;
  const secondUserPointsValue = gameStatus.filter((el) => el.smallGameStatus === '1').length;

  firstUserPoints.innerHTML = firstUserPointsValue;
  secondUserPoints.innerHTML = secondUserPointsValue;
  if (gameArrayData.gameStatus) {
    if (whoMoveId(gameArrayData) === +firstUserId) {
      currentFigureName.innerHTML = 'O';
      currentUserName.innerHTML = firstUserName;
    } else {
      currentFigureName.innerHTML = '1';
      currentUserName.innerHTML = secondUserName;
    }
  } else if (firstUserPointsValue === secondUserPointsValue) {
    gameInfoText.innerHTML = 'ничья!';
  } else if (firstUserPointsValue > secondUserPointsValue) {
    gameInfoText.innerHTML = `победил ${firstUserName}!`;
  } else {
    gameInfoText.innerHTML = `победил ${secondUserName}!`;
  }
}

// #################################################

document.addEventListener('click', (event) => {
  console.log(event.target);
  console.log(event.target.classList.value);
  if (event.target.classList.value.indexOf('cell active') >= 0) {
    const cellId = event.target.id.split('-').map((el) => +el);
    console.log('cellId ===>', cellId);
    socket.send(JSON.stringify({ type: 'roomGameData', payload: { cellId, roomNumber } }));
  }
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const { value } = event.target.chatInp;
  // console.log('value ===>', value);
  socket.send(JSON.stringify({ type: 'roomChatMessage', payload: { value, roomNumber } }));
  chatForm.reset();
});

socket.onopen = () => {
  console.log('SOCKET OPEN');
  socket.send(JSON.stringify({ type: 'roomOnline', payload: { userId: +userId, roomNumber } }));
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const { type, payload } = data;

  switch (type) {
    case 'online':
      console.log('USER ONLINE', payload);
      // console.log(payload.usersMapData);
      usersRoomStatusUpdate(payload);
      break;

    case 'offline':
      console.log('USER OFFLINE', payload);
      // console.log(payload.usersMapData);
      usersRoomStatusUpdate(payload);
      break;

    case 'roomChatMessage':
      console.log('ROOM CHAT MESSAGE', payload);
      if (payload.roomNumber === roomNumber) {
        addNewMessage(payload);
      }
      break;

    case 'roomOnline':
      console.log('USER ROOM ONLINE', payload);
      // console.log(payload.usersMapData);
      usersRoomStatusUpdate(payload);
      break;

    // ################################
    case 'roomGameUpdate':
      if (payload.roomNumber === roomNumber) {
        console.log('ROOM GAME UPDATE', payload);
        const gameArrayData = JSON.parse(payload.gameArrayData);
        console.log('gameArrayData ===>', gameArrayData);
        console.log('whoMoveId ===>', whoMoveId(gameArrayData));
        renderGameBlock(gameArrayData);
        renderGameInfo(gameArrayData);
        console.log('======================>', getGameStatus(gameArrayData));
      }
      break;

    case 'roomGameChitter':
      if (payload.roomNumber === roomNumber) {
        console.log('ROOM GAME CHITTER', payload);
        setTimeout(() => {
          gameInfoText.classList.add('chiter');
          gameInfoText.innerHTML = `${payload.userName} пытался читерить! Ход не засчитан!!!`;
        }, 100);
        setTimeout(() => {
          gameInfoText.classList.remove('chiter');
          gameInfoText.innerHTML = `
          ходит &laquo;
          <span id="currentFigureName" class="finger">${payload.userId === +firstUserId ? 'O' : '1'}</span>
          &raquo; &#40;&ensp;
          <span id="currentUserName">${payload.userName}</span>
          &ensp;&#41;
          `;
          currentFigureName = document.querySelector('#currentFigureName');
          currentUserName = document.querySelector('#currentUserName');
        }, 3000);
      }
      break;

    // !!!!! Под "roomGameData" сообщения с сервера не написаны! (???)
    case 'roomGameData':
      if (payload.roomNumber === roomNumber) {
        console.log('ROOM GAME DATA', payload);
        const gameArrayData = JSON.parse(payload.gameArrayData);
        console.log('gameArrayData ===>', gameArrayData);
        console.log('whoMoveId ===>', whoMoveId(gameArrayData));
        renderGameBlock(gameArrayData);
        renderGameInfo(gameArrayData);

        console.log('======================>', getGameStatus(gameArrayData));
      }
      break;

    default:
      console.log('Unknown message type!');
      break;
  }
};

socket.onclose = () => {
  console.log('SOCKET CLOSE');
  firstUserSpan.className = 'offline';
  secondUserSpan.className = 'offline';
};

socket.onerror = (error) => {
  console.log(error);
};
