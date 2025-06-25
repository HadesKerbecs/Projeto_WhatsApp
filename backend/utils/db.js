// utils/db.js - Conexão com MongoDB usando Mongoose

const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/seu_banco_de_dados'; // Troque para sua URI MongoDB, ex: Mongo Atlas

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar no MongoDB:', error);
    process.exit(1); // Sai do processo com erro
  }
};

module.exports = connectDB;
