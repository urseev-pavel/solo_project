require('@babel/register');
require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const path = require('path');

const session = require('express-session');
const FileStore = require('session-file-store')(session);

const httpServer = require('http');
const wsServer = require('./websocket');

const dbConnectCheck = require('../db/dbConnectCheck');

const app = express();
const PORT = process.env.PORT ?? 3000;
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'qwerty';

dbConnectCheck(); // !!! Проверка подключения к БД

const indexRoutes = require('./routes/indexRoutes');
const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');
const logoutRoutes = require('./routes/logoutRoutes');
const roomRoutes = require('./routes/roomRoutes');
const antiStressRoutes = require('./routes/antiStressRoutes');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));
// console.log('path ===>', path.join(__dirname, '../public'));

const sessionConfig = {
  name: 'myCookie',
  store: new FileStore(),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: (1000 * 60 * 60 * 24 * 10),
    secure: false,
    httpOnly: true,
  },
};

const sessionParser = session(sessionConfig);
app.use(sessionParser);

app.use('/', indexRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);
app.use('/room', roomRoutes);
app.use('/antistress', antiStressRoutes);

app.get('*', (req, res) => {
  res.redirect('/');
});

app.locals.usersMap = new Map();

const server = httpServer.createServer(app);
server.on('upgrade', (req, socket, head) => {
  sessionParser(req, {}, () => {
    if (!req.session.user) {
      socket.write('ERROR: STATUS 401');
      socket.destroy();
    }
    wsServer.handleUpgrade(req, socket, head, (ws) => {
      wsServer.emit('connection', ws, req, app.locals.usersMap);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
