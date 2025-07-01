require('./scripts/agendaLimpeza');
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Configurações básicas
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Rotas da API
const produtoRoutes = require('./routes/produtoRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const mensagemRoutes = require('./routes/mensagemRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

app.use('/api/clientes', clienteRoutes);
app.use('/webhook', webhookRoutes);
app.use('/whatsapp', whatsappRoutes);
app.use('/api/mensagens', mensagemRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/auth', authRoutes);

// Serve arquivos estáticos do Angular (ANTES do fallback)
app.use(express.static(path.join(__dirname, '../painel-produtos/dist/painel-produtos')));

// Fallback - redireciona todas rotas que NÃO começarem com /api ou /webhook, etc, para o index.html do Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../painel-produtos/dist/painel-produtos/index.html'));
});

// Rota raiz (opcional)
app.get('/', (req, res) => {
  res.send('API Rodando...');
});

// Inicia o servidor (depois de tudo estar configurado)
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
