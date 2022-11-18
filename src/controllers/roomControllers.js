const renderTemplate = require('../lib/renderTemplate');
const Room = require('../views/Room');

const { User } = require('../../db/models');

const renderRoom = async (req, res) => {
  // console.log('req.params ===>', req.params);
  const { firstUserId, secondUserId } = req.params;
  if (firstUserId === secondUserId) {
    res.redirect('/');
  } else {
    try {
      const firstUserData = await User.findByPk(+firstUserId, { attributes: ['id', 'name'] });
      const secondUserData = await User.findByPk(+secondUserId, { attributes: ['id', 'name'] });
      // console.log('===>', firstUserData?.get(), secondUserData?.get());
      if (!firstUserData || !secondUserData) {
        res.redirect('/');
      } else {
        const { user } = req.session;
        if (user.userId === +firstUserId || user.userId === +secondUserId) {
          // console.log('user ===>', user);
          renderTemplate(Room, { user, firstUserData, secondUserData }, res);
        } else {
          res.redirect('/');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = { renderRoom };
