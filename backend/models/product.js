// models/product.js - Modelo do Produto

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  descricao: { type: String, default: '' },
  empresaId: { type: String, required: true }
}, {
  timestamps: true, // Cria createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('Product', productSchema);
