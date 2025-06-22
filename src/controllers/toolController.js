const { getToolBySlug } = require('../repository/toolRepository');

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

module.exports = { getToolDetail };
