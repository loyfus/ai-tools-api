require('express-async-errors');  // captura erros em async/await
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const compression = require('compression');
const { port } = require('./config');
const searchRoutes = require('./routes/searchRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const toolRoutes = require('./routes/toolRoutes');

const app = express();

// Slowdown/Rate Limiter
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 30,           // allow 30 requests within 15 minutes, then...
  delayMs: 500              // begin adding 500ms of delay per request
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,                  // limit each IP to 60 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
});

// Middlewares
app.use(speedLimiter); // Gradually slow down repeated requests
app.use(limiter);      // Block excessive requests
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(hpp());
app.use(xss());
app.use(morgan('tiny'));
app.use(compression());

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
