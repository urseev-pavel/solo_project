const router = require('express').Router();
const { renderAntiStress } = require('../controllers/antiStressControllers');
const { isAuth } = require('../middlewares/isAuth');

router.get('/', isAuth, renderAntiStress);

module.exports = router;
