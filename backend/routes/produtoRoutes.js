const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

// 🟢 Coloca o middleware ANTES de declarar as rotas
router.use(authMiddleware);

// Agora sim, todas as rotas abaixo já têm o usuário no req.user
router.get('/', productController.listar);
router.get('/:id', productController.buscarPorId);
router.post('/', productController.criar);
router.put('/:id', productController.atualizar);
router.delete('/:id', productController.remover);

module.exports = router;
