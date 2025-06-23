// src/services/searchService.js
const { getNativeCollection } = require('../repository/toolRepository');
const { search: cfgSearch }   = require('../config');

async function runAtlasSearch(query, page = 1, pageSize = cfgSearch.topK) {
  const coll = await getNativeCollection();
  const skip = (page - 1) * pageSize;

  const pipeline = [
    {
      $search: {
        index: cfgSearch.indexName,
        compound: {
          should: [
            { text: { query, path: 'name', score: { boost: { value: 3 } } } },
            { text: { query, path: ['description_en','description_pt','description_es'] } }
          ]
        }
      }
    },
    { $sort:  { score: -1 } },       // ordena antes de paginar
    { $skip:  skip },                // pula (page-1)*pageSize documentos
    { $limit: pageSize },            // pega pageSize documentos
    {
      $project: {
        _id:           0,
        slug:          1,
        name:          1,
        description_en: 1,
        description_pt: 1,
        description_es: 1,
        logoBase64:    1,            // inclui o ícone
        score:         { $meta: 'searchScore' }
      }
    }
  ];

  return coll.aggregate(pipeline).toArray();
}

module.exports = { runAtlasSearch };