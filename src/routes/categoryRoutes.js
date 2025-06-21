const express = require('express');
const { listCategories, listToolsByCategories } = require('../controllers/categoryController');

const router = express.Router();

router.get('/', listCategories);
router.get('/tools', listToolsByCategories);

module.exports = router;
