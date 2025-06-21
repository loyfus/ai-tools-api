require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongo: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  search: {
    topK: parseInt(process.env.TFIDF_TOP_K, 10) || 5,
    indexName: process.env.ATLAS_INDEX_NAME || 'Loyfus-vector'
  }
};
