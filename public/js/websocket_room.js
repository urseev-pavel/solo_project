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
const secondUserSpan = document.querySelector('#secondUser');
const secondUserName = secondUserSpan.dataset.userName;
// console.log('===>', { firstUserName, secondUserName });

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

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const { value } = event.target.chatInp;
  // console.log('value ===>', value);
  socket.send(JSON.stringify({ type: 'roomChatMessage', payload: { value, roomNumber } }));
  chatForm.reset();
});

socket.onopen = () => {
  console.log('SOCKET OPEN');
  socket.send(JSON.stringify({ type: 'room-online', payload: { userId: +userId, roomNumber } }));
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

    case 'room-online':
      console.log('USER ROOM ONLINE', payload);
      // console.log(payload.usersMapData);
      usersRoomStatusUpdate(payload);
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
