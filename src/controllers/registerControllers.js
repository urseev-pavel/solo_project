const bcrypt = require('bcrypt'); // !!! Поключаем "bcrypt" для хеширования пароля
const renderTemplate = require('../lib/renderTemplate');
const Register = require('../views/Register');

const { User } = require('../../db/models');

const renderRegister = (req, res) => {
  // console.log('req.session ===>', req.session);
  if (req.session.user) {
    // !!! Защита ручки от вхождения в неё
    res.redirect('/');
  } else {
    renderTemplate(Register, null, res);
  }
};

const registerUser = async (req, res) => {
  // console.log('req.body ===>', req.body);
  try {
    const { userName, userEmail, userPassword } = req.body;
    // console.log('===>', { userName, userEmail, userPassword });
    const userData = await User.findOne({ where: { email: userEmail } });
    if (userData) {
      // console.log('===> NEED-NEW-EMAIL');
      res.json({ backResult: 'NEED-NEW-EMAIL' });
    } else {
      const hashUserPassword = await bcrypt.hash(userPassword, 9); // !!! Хеширование пароля перед записью в БД ('9' - кол-во циклов хеширования)
      const newUserData = await User.create({ name: userName, email: userEmail, password: hashUserPassword });
      // console.log('===>', { userName: newUserData.name, userId: newUserData.id });
      req.session.user = { userName: newUserData.name, userId: newUserData.id };
      // !!! Перед отправкой ответа на "фронт" необходимо дождаться записи файла в "sessions" при помощи следующей конструкции:
      req.session.save(() => {
        res.json({ backResult: 'REGISTER-OK' });
      });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

module.exports = { renderRegister, registerUser };
