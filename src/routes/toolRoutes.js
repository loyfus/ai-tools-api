const express = require('express');
const { listAllTools, getToolDetail } = require('../controllers/toolController');

const router = express.Router();

/**
 * GET /tools
 * Lista todas as ferramentas
 */
router.get('/', listAllTools);

router.get('/:slug', getToolDetail);

module.exports = router;
