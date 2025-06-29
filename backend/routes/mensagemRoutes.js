const express = require('express');
const router = express.Router();
const mensagemController = require('../controllers/mensagemController');
router.use(authMiddleware);

router.get('/', mensagemController.listarMensagens);
router.post('/enviar', mensagemController.enviarMensagem);

module.exports = router;
