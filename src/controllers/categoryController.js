const { getAllCategories, getToolsByCategories } = require('../repository/toolRepository');

const MAX_PAGE_SIZE = 50;   // limite máximo permitido para paginação

async function listCategories(req, res, next) {
  try {
    const pg   = parseInt(req.query.page,     10) || 1;
    const size = parseInt(req.query.pageSize, 10) || 20;
    if (size < 1 || size > MAX_PAGE_SIZE) {
      return res.status(400).json({ error: `pageSize deve estar entre 1 e ${MAX_PAGE_SIZE}.` });
    }
    const categories = await getAllCategories(pg, size);
    res.json({ page: pg, pageSize: size, categories });
  } catch (err) {
    next(err);
  }
}

async function listToolsByCategories(req, res, next) {
  try {
    let { categories } = req.query;
    if (!categories) {
      return res.status(400).json({ error: 'Categoria é obrigatória.' });
    }

    if (!Array.isArray(categories)) {
      categories = String(categories).split(',').map(c => c.trim()).filter(Boolean);
    }

    const pg   = parseInt(req.query.page,     10) || 1;
    const size = parseInt(req.query.pageSize, 10) || 20;
    if (size < 1 || size > MAX_PAGE_SIZE) {
      return res.status(400).json({ error: `pageSize deve estar entre 1 e ${MAX_PAGE_SIZE}.` });
    }
    const tools = await getToolsByCategories(categories, pg, size);
    res.json({ categories, page: pg, pageSize: size, tools });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listCategories,
  listToolsByCategories
};
