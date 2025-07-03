// routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const Cliente = require('../models/cliente');

router.post('/cadastrar', async (req, res) => {
  const { numero, empresaId } = req.body;

  if (!numero || !empresaId) {
    return res.status(400).json({ message: 'Informe número e empresaId' });
  }

  try {
    // Verifica se número já existe
    const numeroExistente = await Cliente.findOne({ numero });
    if (numeroExistente) {
      return res.status(409).json({ message: 'Número já cadastrado' });
    }

    // Aqui NÃO valida se empresaId existe (pode ser novo)
    const cliente = new Cliente({ numero, empresaId });
    await cliente.save();

    return res.status(201).json(cliente);
  } catch (err) {
    console.error('Erro ao cadastrar cliente:', err);
    return res.status(500).json({ message: 'Erro ao cadastrar cliente', error: err.message });
  }
});


module.exports = router;
