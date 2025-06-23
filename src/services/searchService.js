// src/services/searchService.js
const { getNativeCollection } = require('../repository/toolRepository');
const { search: cfgSearch }   = require('../config');

async function runAtlasSearch(query, page = 1, pageSize = cfgSearch.topK) {
  const coll = await getNativeCollection();
  const skip = (page - 1) * pageSize;

  const baseStages = [
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
    { $sort: { score: -1 } }
  ];

  const pipeline = [
    ...baseStages,
    {
      $facet: {
        metadata: [ { $count: 'total' } ],
        results: [
          { $skip: skip },
          { $limit: pageSize },
          {
            $project: {
              _id: 0,
              slug: 1,
              name: 1,
              description_en: 1,
              description_pt: 1,
              description_es: 1,
              logoBase64: 1,
              score: { $meta: 'searchScore' }
            }
          }
        ]
      }
    }
  ];

  const [facetResult] = await coll.aggregate(pipeline).toArray();
  const total = facetResult.metadata[0] ? facetResult.metadata[0].total : 0;
  const results = facetResult.results;

  return { total, results };
}

module.exports = { runAtlasSearch };
