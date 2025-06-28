const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware); // proteger a rota, só usuário logado pode usar

router.post('/', chatController.chat);

module.exports = router;
