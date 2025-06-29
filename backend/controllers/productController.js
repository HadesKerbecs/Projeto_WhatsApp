// controllers/productController.js - Funções para manipular produtos

const Product = require('../models/product');

exports.listar = async (req, res) => {
  try {
    const produtos = await Product.find({ empresaId: req.user.empresaId });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar produtos', error });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const produto = await Product.findOne({ _id: req.params.id, empresaId: req.user.empresaId });
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(produto);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto', error });
  }
};

exports.criar = async (req, res) => {
  try {
    const novoProduto = new Product({ ...req.body, empresaId: req.user.empresaId });
    const salvo = await novoProduto.save();
    res.status(201).json(salvo);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar produto', error });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const atualizado = await Product.findOneAndUpdate({ _id: req.params.id, empresaId: req.user.empresaId }, req.body, { new: true });
    if (!atualizado) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(atualizado);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar produto', error });
  }
};

exports.remover = async (req, res) => {
  try {
    const removido = await Product.findOneAndDelete({ _id: req.params.id, empresaId: req.user.empresaId });
    if (!removido) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover produto', error });
  }
};
