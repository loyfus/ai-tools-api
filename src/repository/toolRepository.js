// src/repository/toolRepository.js
const mongoose = require('mongoose');
const { mongo } = require('../config');

const toolSchema = new mongoose.Schema({
  slug:           { type: String, required: true, unique: true },
  name:           { type: String, required: true },
  description_en: { type: String },
  description_pt: { type: String },
  description_es: { type: String },
  logoBase64:     { type: String },
  officialUrl:    { type: String },
  pricingModel:   { type: String }
}, { collection: 'tools' });

const Tool = mongoose.models.Tool || mongoose.model('Tool', toolSchema);

let isConnected = false;
async function init() {
  if (isConnected) return;
  await mongoose.connect(mongo.uri, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
    dbName:             mongo.dbName
  });
  isConnected = true;
}

async function getAllTools() {
  await init();
  return Tool.find(
    {},
    { _id:0, slug:1, name:1, description_en:1, description_pt:1, description_es:1 }
  ).lean();
}

// Novo método: coleção nativa para agregação
async function getNativeCollection() {
  await init();
  return mongoose.connection.db.collection('tools');
}

module.exports = {
  init,
  getAllTools,
  getToolCollection: () => Tool,
  getNativeCollection
};
