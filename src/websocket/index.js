const WebSocket = require('ws');

const wsServer = new WebSocket.WebSocketServer({ clientTracking: true, noServer: true });

function convertMap(usersMap) {
  return Object.entries(Object.fromEntries(usersMap))
    .map((el) => el[1])
    .sort((a, b) => a.updatedAtTimestamp - b.updatedAtTimestamp);
}

// ##############################################

function moveCounter(gameArrayData) {
  return gameArrayData.gameArray.map((el) => el.filter((subEl) => subEl !== null).length).reduce((acc, curr) => acc + curr, 0);
}

function whoMove(gameArrayData) {
  return moveCounter(gameArrayData) % 2 === 0 ? 'O' : '1';
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

// ##############################################

const newGameArray = JSON.parse(JSON.stringify(new Array(9).fill(new Array(9).fill(null))));
// console.log('newGameArray ===>', newGameArray);

wsServer.on('connection', (ws, req, usersMap, gamesMap) => {
  const { user } = req.session;
  // console.log('user ===>', user);
  // console.log('wsServer.clients.size ===>', wsServer.clients.size);

  usersMap.set(user.userId, { ...user, userStatus: 'chat', updatedAtTimestamp: Date.now() });
  // console.log('usersMap ===>', usersMap);

  const usersMapData = convertMap(usersMap);
  // console.log('usersMapData ===>', usersMapData);

  wsServer.clients.forEach((currentClient) => {
    currentClient.send(JSON.stringify({ type: 'online', payload: { ...user, clientsSize: wsServer.clients.size, usersMapData } }));
  });

  ws.on('message', (data) => {
    const utfData = JSON.parse(data.toString('utf8'));
    // console.log('utfData ===>', utfData);
    const { type, payload } = utfData;

    let gameArrayData;
    let smallGameIndex;
    let cellIndex;
    let nextActiveSmallGame;

    switch (type) {
      case 'chatMessage':
        // console.log('chatMessage >>> payload ===>', payload);
        utfData.payload.clientsSize = wsServer.clients.size;
        utfData.payload.userName = user.userName;
        utfData.payload.userId = user.userId;
        // console.log('utfData ===>', utfData);
        wsServer.clients.forEach((currentClient) => {
          currentClient.send(JSON.stringify(utfData));
        });
        break;

      case 'roomChatMessage':
        // console.log('roomChatMessage >>> payload ===>', payload);
        utfData.payload.clientsSize = wsServer.clients.size;
        utfData.payload.userName = user.userName;
        utfData.payload.userId = user.userId;
        // console.log('utfData ===>', utfData);
        wsServer.clients.forEach((currentClient) => {
          currentClient.send(JSON.stringify(utfData));
        });
        break;

      case 'roomOnline':
        // console.log('roomOnline >>> payload ===>', payload);
        // eslint-disable-next-line no-case-declarations
        const userInfo = usersMap.get(payload.userId);
        userInfo.userStatus = `room-${payload.roomNumber}`;
        userInfo.updatedAtTimestamp = Date.now();
        // console.log('userInfo ===>', userInfo);
        usersMap.set(payload.userId, userInfo);
        wsServer.clients.forEach((currentClient) => {
          currentClient.send(JSON.stringify({ type: 'roomOnline', payload: { ...user, clientsSize: wsServer.clients.size, usersMapData: convertMap(usersMap) } }));
        });
        // ############################################
        if (gamesMap.get(payload.roomNumber)) {
          gameArrayData = JSON.stringify(gamesMap.get(payload.roomNumber));
          console.log('gameArrayData ===>', gameArrayData);
        } else {
          gamesMap.set(payload.roomNumber, {
            gameArray: newGameArray, lastMove: null, activeSmallGames: [4], gameStatus: true, // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          });
          gameArrayData = JSON.stringify(gamesMap.get(payload.roomNumber));
          console.log('gameArrayData NEW ===>', gameArrayData);
        }
        wsServer.clients.forEach((currentClient) => {
          currentClient.send(JSON.stringify({ type: 'roomGameUpdate', payload: { ...user, gameArrayData, roomNumber: payload.roomNumber } }));
        });
        // ############################################
        break;

      case 'roomGameData':
        console.log('roomGameData >>> payload ===>', payload);
        // console.log('utfData ===>', utfData);
        gameArrayData = gamesMap.get(payload.roomNumber);
        console.log('gameArrayData ===>', gameArrayData);
        [smallGameIndex, cellIndex] = payload.cellId;
        console.log('===>', { smallGameIndex, cellIndex });

        if (gameArrayData.activeSmallGames.indexOf(smallGameIndex) < 0) {
          console.log('===> CHITTER');
          wsServer.clients.forEach((currentClient) => {
            currentClient.send(JSON.stringify({ type: 'roomGameChitter', payload: { ...user, roomNumber: payload.roomNumber } }));
          });
        } else {
          if (gameArrayData && gameArrayData.gameArray[smallGameIndex][cellIndex] === null) {
            const { smallGameStatus } = checkSmallGame(gameArrayData.gameArray[payload.cellId[0]]);
            console.log('smallGameStatus ===>', smallGameStatus);
            if (smallGameStatus === 'open') {
              console.log('===> MOVE OK');

              gameArrayData.gameArray[smallGameIndex][cellIndex] = whoMove(gameArrayData);

              const gameStatus = getGameStatus(gameArrayData);
              console.log('gameStatus ===>', gameStatus);

              if (gameStatus.filter((el) => el.smallGameStatus === 'open').length > 0) {
                [nextActiveSmallGame] = gameStatus.filter((el) => el.smallGameId === cellIndex);
                console.log('nextActiveSmallGame ===>', nextActiveSmallGame);
                if (nextActiveSmallGame.smallGameStatus === 'open') {
                  gameArrayData.activeSmallGames = [cellIndex];
                  gameArrayData.lastMove = payload.cellId;
                  console.log('gameArrayData ===>', gameArrayData);
                } else {
                  gameArrayData.activeSmallGames = gameStatus.filter((el) => el.smallGameStatus === 'open').map((el) => el.smallGameId);
                  gameArrayData.lastMove = payload.cellId;
                  console.log('gameArrayData ===>', gameArrayData);
                }
              } else {
                console.log('===> GAME OVER');
                gameArrayData.activeSmallGames = [];
                gameArrayData.lastMove = payload.cellId;
                gameArrayData.gameStatus = false;
                // gamesMap.delete(payload.roomNumber);
              }
            } else {
              console.log('===> CHITTER');
              wsServer.clients.forEach((currentClient) => {
                currentClient.send(JSON.stringify({ type: 'roomGameChitter', payload: { ...user, roomNumber: payload.roomNumber } }));
              });
            }
          } else {
            console.log('===> CHITTER');
            wsServer.clients.forEach((currentClient) => {
              currentClient.send(JSON.stringify({ type: 'roomGameChitter', payload: { ...user, roomNumber: payload.roomNumber } }));
            });
          }
          gameArrayData = JSON.stringify(gameArrayData);
          wsServer.clients.forEach((currentClient) => {
            currentClient.send(JSON.stringify({ type: 'roomGameUpdate', payload: { ...user, gameArrayData, roomNumber: payload.roomNumber } }));
          });
        }

        break;

      default:
        console.log('Unknown message type!');
        break;
    }
  });

  ws.on('close', () => {
    usersMap.delete(user.userId);
    wsServer.clients.forEach((currentClient) => {
      currentClient.send(JSON.stringify({ type: 'offline', payload: { ...user, clientsSize: wsServer.clients.size, usersMapData: convertMap(usersMap) } }));
    });
  });
});

module.exports = wsServer;
