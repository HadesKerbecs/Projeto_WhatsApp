const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  empresaId: { type: String, required: true }
});

module.exports = mongoose.model('Cliente', clienteSchema);
