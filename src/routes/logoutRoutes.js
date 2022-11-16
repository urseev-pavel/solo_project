const router = require('express').Router();
const { logoutUser } = require('../controllers/logoutControllers');

router.get('/', logoutUser);

module.exports = router;
