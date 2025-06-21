const { getAllCategories, getToolsByCategory } = require('../repository/toolRepository');

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

async function listToolsByCategory(req, res, next) {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({ error: 'Categoria é obrigatória.' });
    }
    const pg   = parseInt(req.query.page,     10) || 1;
    const size = parseInt(req.query.pageSize, 10) || 20;
    const tools = await getToolsByCategory(category, pg, size);
    res.json({ category, page: pg, pageSize: size, tools });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listCategories,
  listToolsByCategory
};
