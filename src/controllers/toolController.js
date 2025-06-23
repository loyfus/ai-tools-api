const { getAllTools, getToolBySlug } = require('../repository/toolRepository');

const MAX_PAGE_SIZE = 50;   // limite máximo permitido para paginação

async function listAllTools(req, res, next) {
  try {
    const pg   = parseInt(req.query.page,     10) || 1;
    const size = parseInt(req.query.pageSize, 10) || 20;
    if (size < 1 || size > MAX_PAGE_SIZE) {
      return res.status(400).json({ error: `pageSize deve estar entre 1 e ${MAX_PAGE_SIZE}.` });
    }
    const tools = await getAllTools(pg, size);
    res.json({ page: pg, pageSize: size, tools });
  } catch (err) {
    next(err);
  }
}

async function getToolDetail(req, res, next) {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ error: 'Slug é obrigatório.' });
    }

    const tool = await getToolBySlug(slug);
    if (!tool) {
      return res.status(404).json({ error: 'Ferramenta não encontrada.' });
    }

    res.json(tool);
  } catch (err) {
    next(err);
  }
}

module.exports = { listAllTools, getToolDetail };
