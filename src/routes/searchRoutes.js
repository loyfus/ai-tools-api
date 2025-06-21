const express = require('express');
const { searchTools } = require('../controllers/searchController');

const router = express.Router();

/**
 * GET /api/search?q=<termo>&k=<topK>
 * Retorna top-K resultados de busca por TF–IDF.
 */
router.get('/', searchTools);

module.exports = router;
