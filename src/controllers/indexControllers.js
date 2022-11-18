const renderTemplate = require('../lib/renderTemplate');
const Main = require('../views/Main');
const Beaver = require('../views/Beaver');

const renderMain = (req, res) => {
  if (req.session?.user) {
    const { user } = req.session;
    // console.log('user ===>', user);
    renderTemplate(Main, { user }, res);
  } else {
    renderTemplate(Beaver, null, res);
  }
};

module.exports = { renderMain };
