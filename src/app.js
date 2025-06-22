require('express-async-errors');  // captura erros em async/await
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const { port } = require('./config');
const searchRoutes = require('./routes/searchRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const toolRoutes = require('./routes/toolRoutes');

const app = express();

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100                  // limit each IP to 100 requests per window
});

// Middlewares
app.use(limiter); // Protect against DDoS/brute force
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(hpp());
app.use(xss());
app.use(morgan('tiny'));

// Rotas
app.get('/', (req, res) => {
  res.json({ message: 'Loyfus API online' });
});
app.use('/search', searchRoutes);
app.use('/categories', categoryRoutes);
app.use('/tools', toolRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

// Inicia servidor
app.listen(port, () => {
  console.log(`🚀 Loyfus API rodando em http://localhost:${port}`);
});
