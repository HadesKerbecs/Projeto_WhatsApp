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
    const cliente = new Cliente({ numero, empresaId });
    await cliente.save();
    res.status(201).json(cliente);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao cadastrar cliente', error: err.message });
  }
});

module.exports = router;
