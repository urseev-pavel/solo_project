const renderTemplate = require('../lib/renderTemplate');
const Main = require('../views/Main');

const renderMain = (req, res) => {
  if (req.session?.user) {
    const { user } = req.session;
    console.log('user ===>', user);
    renderTemplate(Main, { user }, res);
  } else {
    res.redirect('/login');
  }
};

module.exports = { renderMain };
