// src/controllers/searchController.js
const { runAtlasSearch } = require('../services/searchService');

const MAX_PAGE_SIZE = 50;   // limite máximo permitido para paginação

async function searchTools(req, res, next) {
  try {
    const { q, page, pageSize } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Parâmetro "q" é obrigatório.' });
    }

    const pg   = parseInt(page,     10) || 1;
    let size   = pageSize !== undefined ? parseInt(pageSize, 10) : undefined;  // se undefined, cai no default do service
    if (size !== undefined) {
      if (Number.isNaN(size) || size < 1 || size > MAX_PAGE_SIZE) {
        return res.status(400).json({ error: `pageSize deve estar entre 1 e ${MAX_PAGE_SIZE}.` });
      }
    }

    const { total, results } = await runAtlasSearch(q, pg, size);
    res.json({
      query:     q,
      page:      pg,
      pageSize:  size,
      total,
      results
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { searchTools };
