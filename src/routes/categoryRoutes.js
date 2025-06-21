const express = require('express');
const { listCategories, listToolsByCategory } = require('../controllers/categoryController');

const router = express.Router();

router.get('/', listCategories);
router.get('/:category/tools', listToolsByCategory);

module.exports = router;
