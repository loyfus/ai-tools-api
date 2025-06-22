const express = require('express');
const { getToolDetail } = require('../controllers/toolController');

const router = express.Router();

router.get('/:slug', getToolDetail);

module.exports = router;
