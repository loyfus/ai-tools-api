const { getAllCategories, getToolsByCategories } = require('../repository/toolRepository');

async function listCategories(req, res, next) {
  try {
    const pg   = parseInt(req.query.page,     10) || 1;
    const size = parseInt(req.query.pageSize, 10) || 20;
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
