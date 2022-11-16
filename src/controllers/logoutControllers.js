const logoutUser = async (req, res) => {
  try {
    // console.log('req.session ===>', req.session);
    if (req.session.user) {
      // !!! Перед уничтожениеием "куки" и "редиректом" необходимо дождаться удаления файла из "sessions" при помощи следующей конструкции:
      req.session.destroy(() => {
        res.clearCookie('myCookie');
        res.redirect('/');
      });
    } else {
      // !!! Защита ручки от вхождения в неё
      res.redirect('/');
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

module.exports = { logoutUser };
