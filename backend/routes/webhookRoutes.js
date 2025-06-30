const express = require('express');
const router = express.Router();
const Mensagem = require('../models/mensagem'); // importe seu model

router.post('/mensagens', async (req, res) => {
  console.log('=== Mensagem recebida no webhook ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  try {
    // Exemplo básico extraindo dados da requisição do Twilio
    const novaMensagem = new Mensagem({
      cliente: req.body.WaId || 'desconhecido',  // número do cliente
      mensagem: req.body.Body || '',
      bot: false,
      status: 'recebida',
      data: new Date(),
      empresaId: 'empresa-teste',  // você precisa pegar o empresaId de algum lugar
    });

    await novaMensagem.save();

    res.status(200).send('<Response></Response>');
  } catch (err) {
    console.error('Erro ao salvar mensagem do webhook:', err);
    res.status(500).send('<Response></Response>');
  }
});

module.exports = router;
