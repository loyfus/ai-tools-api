require('express-async-errors');  // captura erros em async/await
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const { port } = require('./config');
const searchRoutes = require('./routes/searchRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// Rotas
app.use('/api/search', searchRoutes);
app.use('/api/categories', categoryRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

// Inicia servidor
app.listen(port, () => {
  console.log(`🚀 Loyfus API rodando em http://localhost:${port}`);
});
