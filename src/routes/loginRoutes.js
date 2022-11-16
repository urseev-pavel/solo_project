const router = require('express').Router();
const { renderLogin, loginUser } = require('../controllers/loginControllers');

router.route('/')
  .get(renderLogin)
  .post(loginUser);

module.exports = router;
