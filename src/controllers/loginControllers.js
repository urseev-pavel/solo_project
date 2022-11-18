const bcrypt = require('bcrypt'); // !!! Поключаем "bcrypt" для хеширования пароля
const renderTemplate = require('../lib/renderTemplate');
const Login = require('../views/Login');

const { User } = require('../../db/models');

const renderLogin = (req, res) => {
  // console.log('req.session ===>', req.session);
  if (req.session.user) {
    // !!! Защита ручки от вхождения в неё
    res.redirect('/');
  } else {
    renderTemplate(Login, null, res);
  }
};

const loginUser = async (req, res) => {
  // console.log('req.body ===>', req.body);
  try {
    const { userEmail, userPassword } = req.body;
    // console.log('===>', { userEmail, userPassword });
    const userData = await User.findOne({ where: { email: userEmail } });
    if (!userData) {
      // console.log('===> BAD-EMAIL');
      res.json({ backResult: 'BAD-EMAIL' });
    } else {
      const passCheck = await bcrypt.compare(userPassword, userData.password); // !!! Сверка пароля с захешированным паролем в БД
      if (passCheck) {
        req.session.user = { userName: userData.name, userId: userData.id };
        // !!! Перед отправкой ответа на "фронт" необходимо дождаться записи файла в "sessions" при помощи следующей конструкции:
        req.session.save(() => {
          // console.log('===> LOGIN-OK');
          res.json({ backResult: 'LOGIN-OK' });
        });
      } else {
        // console.log('===> BAD-PASSWORD');
        res.json({ backResult: 'BAD-PASSWORD' });
      }
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

module.exports = { renderLogin, loginUser };
