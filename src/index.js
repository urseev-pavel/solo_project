require('@babel/register');
require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const path = require('path');

const session = require('express-session');
const FileStore = require('session-file-store')(session);

const dbConnectCheck = require('../db/dbConnectCheck');

const app = express();
const PORT = process.env.PORT ?? 3000;
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'qwerty';

dbConnectCheck(); // !!! Проверка подключения к БД

const indexRoutes = require('./routes/indexRoutes');
const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');
const logoutRoutes = require('./routes/logoutRoutes');

app.use(logger('dev')); // !!! 'dev' - параметр, отвечающий за стиль отображения информации logger'ом (ещё есть 'short' и 'tiny')
app.use(express.json()); // !!! Для расшифровки запросов
app.use(express.urlencoded({ extended: false })); // !!! Для расшифровки запросов ({ extended: false } - увеличение объёма информации)
app.use(express.static(path.join(__dirname, '../public'))); // !!! Для подключения на "фронте" файлов из папки "public"
// console.log('path ===>', path.join(__dirname, '../public'));

// !!! Создание "конфига" для "куки"
const sessionConfig = {
  name: 'myCookie', // * Название "куки"
  store: new FileStore(), // * Подключение хранилища, которое будет использоваться для хранения "куки"
  secret: SESSION_SECRET, // * Ключ для шифрования "куки"
  resave: false, // * Если "true", то "сессия" будет пересохраняться в хранилище, даже если она не изменилась
  saveUninitialized: false, // * Если "false", то "куки" появляются только при установке "req.session" (если "true", то в хранилище будут попадать пустые "сессии")
  cookie: {
    maxAge: (1000 * 60 * 60 * 24 * 10), // * Время жизни "куки" в миллисекундах (10 дней)
    secure: false, // * Если "true", то "куки" будут отправляться только по протоколу "HTTPS"
    httpOnly: true, // * Если "true", то "куки" будут изменяться только сервером
  },
};

app.use(session(sessionConfig)); // !!! Подключение "мидлвара" для "куки"

app.use('/', indexRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
