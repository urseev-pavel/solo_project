const WebSocket = require('ws');

const wsServer = new WebSocket.WebSocketServer({ clientTracking: true, noServer: true });

function convertMap(usersMap) {
  return Object.entries(Object.fromEntries(usersMap))
    .map((el) => el[1])
    .sort((a, b) => a.updatedAtTimestamp - b.updatedAtTimestamp);
}

wsServer.on('connection', (ws, req, usersMap) => {
  const { user } = req.session;
  // console.log('user ===>', user);
  // console.log('wsServer.clients.size ===>', wsServer.clients.size);

  usersMap.set(user.userId, { ...user, userStatus: 'chat', updatedAtTimestamp: Date.now() });
  // console.log('usersMap ===>', usersMap);

  let usersMapData = convertMap(usersMap);
  // console.log('usersMapData ===>', usersMapData);

  wsServer.clients.forEach((currentClient) => {
    currentClient.send(JSON.stringify({ type: 'online', payload: { ...user, clientsSize: wsServer.clients.size, usersMapData } }));
  });

  ws.on('message', (data) => {
    const utfData = JSON.parse(data.toString('utf8'));
    // console.log('utfData ===>', utfData);
    const { type, payload } = utfData;

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

      case 'room-online':
        // console.log('room-online >>> payload ===>', payload);
        // eslint-disable-next-line no-case-declarations
        const userInfo = usersMap.get(payload.userId);
        userInfo.userStatus = `room-${payload.roomNumber}`;
        userInfo.updatedAtTimestamp = Date.now();
        // console.log('userInfo ===>', userInfo);
        usersMap.set(payload.userId, userInfo);
        usersMapData = convertMap(usersMap);
        wsServer.clients.forEach((currentClient) => {
          currentClient.send(JSON.stringify({ type: 'room-online', payload: { ...user, clientsSize: wsServer.clients.size, usersMapData } }));
        });
        break;

      default:
        console.log('Unknown message type!');
        break;
    }
  });

  ws.on('close', () => {
    usersMap.delete(user.userId);
    usersMapData = convertMap(usersMap);
    wsServer.clients.forEach((currentClient) => {
      currentClient.send(JSON.stringify({ type: 'offline', payload: { ...user, clientsSize: wsServer.clients.size, usersMapData } }));
    });
  });
});

module.exports = wsServer;
