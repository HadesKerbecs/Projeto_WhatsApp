// index.js - backend principal

require('dotenv').config(); // Carrega as variáveis do .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configurações básicas
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

// Middlewares
app.use(cors());
app.use(express.json()); // Para receber JSON no body

// Conexão com MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado com sucesso!'))
.catch((err) => {
  console.error('Erro ao conectar no MongoDB:', err);
  process.exit(1);
});

// Rotas - importe seu arquivo de rotas aqui (exemplo: ./routes/produtoRoutes)
const produtoRoutes = require('./routes/produtoRoutes');
app.use('/api/produtos', produtoRoutes);

// Rota raiz (opcional)
app.get('/', (req, res) => {
  res.send('API Rodando...');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
