const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const authMiddleware = require('../middleware/auth');

router.post('/mensagens', webhookController.receberMensagem);
router.get('/mensagens', authMiddleware, webhookController.listarMensagens);
router.post('/mensagens/enviar', authMiddleware, webhookController.enviarMensagemManual);
router.post('/chat', authMiddleware, webhookController.chatGPT);

module.exports = router;
