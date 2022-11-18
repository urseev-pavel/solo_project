const router = require('express').Router();
const { renderRoom } = require('../controllers/roomControllers');
const { isAuth } = require('../middlewares/isAuth');

router.get('/:firstUserId/:secondUserId', isAuth, renderRoom);

module.exports = router;
