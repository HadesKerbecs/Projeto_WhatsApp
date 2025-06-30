const express = require('express');
const router = express.Router();
const { enviarMensagemWhatsApp } = require('../services/twilioWhatsapp');

// POST /whatsapp/enviar
router.post('/enviar', async (req, res) => {
  const { to, body } = req.body;

  if (!to || !body) {
    return res.status(400).json({ message: 'Parâmetros "to" e "body" são obrigatórios.' });
  }

  try {
    const message = await enviarMensagemWhatsApp(to, body);
    res.status(200).json({ message: 'Mensagem enviada com sucesso', sid: message.sid });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar mensagem', error: error.message });
  }
});

module.exports = router;
