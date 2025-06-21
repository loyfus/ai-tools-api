// src/controllers/searchController.js
const { runAtlasSearch } = require('../services/searchService');

async function searchTools(req, res, next) {
  try {
    const { q, page, pageSize } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Parâmetro "q" é obrigatório.' });
    }

    const pg   = parseInt(page,     10) || 1;
    const size = parseInt(pageSize, 10) || undefined;  // se undefined, cai no default do service

    const results = await runAtlasSearch(q, pg, size);
    res.json({
      query:     q,
      page:      pg,
      pageSize:  size,
      results
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { searchTools };