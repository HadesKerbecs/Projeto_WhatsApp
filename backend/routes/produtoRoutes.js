// routes/productRoutes.js - Rotas REST para produtos

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Listar todos produtos
router.get('/', productController.listar);

// Buscar produto por ID
router.get('/:id', productController.buscarPorId);

// Criar novo produto
router.post('/', productController.criar);

// Atualizar produto
router.put('/:id', productController.atualizar);

// Remover produto
router.delete('/:id', productController.remover);

module.exports = router;
