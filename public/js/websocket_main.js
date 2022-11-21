const socket = new WebSocket(window.location.href.replace(/^http/, 'ws'));

const { userId } = document.querySelector('body').dataset;
// console.log('userId ===>', userId);

const { chatForm } = document.forms;

const chatMessagesDiv = document.querySelector('#chatMessages');
const usersNameDiv = document.querySelector('#usersName');
const myLinksDiv = document.querySelector('#myLinks');

function usersNameDivUpdate(payload) {
  usersNameDiv.innerHTML = `${payload.usersMapData
    .filter((el) => el.userStatus === 'chat')
    .map((el) => (el.userId === +userId ? `<p>${el.userName}</p>` : `<a href="/room/${userId}/${el.userId}">${el.userName}</a><br/>`))
    .join('')}`;
}

function myLinksDivUpdate(payload) {
  const whoInRooms = payload.usersMapData.filter((el) => el.userStatus !== 'chat');
  if (whoInRooms.length > 0) {
    const waitMeUsers = whoInRooms.filter((el) => el.userStatus.split('-')[el.userStatus.split('-').length - 1] === userId);
    const waitMeUsersInMyRooms = whoInRooms.filter((el) => el.userStatus.split('-')[el.userStatus.split('-').length - 2] === userId);
    myLinksDiv.innerHTML = `
      ${waitMeUsers.map((el) => `<a href="/room/${el.userId}/${userId}">${el.userName}</a><br/>`).join('')}
      ${waitMeUsersInMyRooms.map((el) => `<a href="/room/${userId}/${el.userId}">${el.userName}</a><br/>`).join('')}
    `;
  } else {
    myLinksDiv.innerHTML = '';
  }
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
  socket.send(JSON.stringify({ type: 'chatMessage', payload: { value } }));
  chatForm.reset();
});

socket.onopen = () => {
  console.log('SOCKET OPEN');
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const { type, payload } = data;

  switch (type) {
    case 'online':
      console.log('USER ONLINE', payload);
      // console.log(payload.usersMapData);
      usersNameDivUpdate(payload);
      myLinksDivUpdate(payload);
      break;

    case 'offline':
      console.log('USER OFFLINE', payload);
      // console.log(payload.usersMapData);
      usersNameDivUpdate(payload);
      myLinksDivUpdate(payload);
      break;

    case 'roomOnline':
      console.log('USER ROOM ONLINE', payload);
      // console.log(payload.usersMapData);
      usersNameDivUpdate(payload);
      myLinksDivUpdate(payload);
      break;

    case 'chatMessage':
      console.log('CHAT MESSAGE', payload);
      addNewMessage(payload);
      break;

    default:
      console.log('Unknown message type!');
      break;
  }
};

socket.onclose = () => {
  console.log('SOCKET CLOSE');
  usersNameDiv.innerHTML = '';
  myLinksDiv.innerHTML = '';
};

socket.onerror = (error) => {
  console.log(error);
};
