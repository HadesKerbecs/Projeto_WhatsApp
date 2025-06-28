const mongoose = require('mongoose');

const mensagemSchema = new mongoose.Schema({
  cliente: String,
  mensagem: String,
  bot: Boolean,
  data: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mensagem', mensagemSchema);
