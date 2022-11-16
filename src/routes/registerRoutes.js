const router = require('express').Router();
const { renderRegister, registerUser } = require('../controllers/registerControllers');

router.route('/')
  .get(renderRegister)
  .post(registerUser);

module.exports = router;
