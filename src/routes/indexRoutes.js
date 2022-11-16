const router = require('express').Router();
const { renderMain } = require('../controllers/indexControllers');

router.get('/', renderMain);

module.exports = router;
