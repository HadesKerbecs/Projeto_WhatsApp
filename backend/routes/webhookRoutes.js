// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();

router.post('/mensagens', (req, res) => {
  console.log('Webhook Twilio recebeu mensagem:', req.body);

  const { Body, From } = req.body;

  // Aqui você pode salvar no banco ou enviar para seu frontend via websocket

  // Twilio espera uma resposta XML vazia para confirmar recebimento
  res.status(200).send('<Response></Response>');
});

module.exports = router;
