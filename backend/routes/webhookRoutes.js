const express = require('express');
const router = express.Router();

router.post('/mensagens', (req, res) => {
  console.log('=== Mensagem recebida no webhook ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  // Retorna resposta esperada pelo Twilio
  res.status(200).send('<Response></Response>');
});

module.exports = router;
