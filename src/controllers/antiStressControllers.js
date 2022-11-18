const renderTemplate = require('../lib/renderTemplate');
const AntiStress = require('../views/AntiStress');

const renderAntiStress = (req, res) => {
  const { user } = req.session;
  // console.log('user ===>', user);
  renderTemplate(AntiStress, { user }, res);
};

module.exports = { renderAntiStress };
