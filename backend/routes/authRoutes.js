const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const SECRET = process.env.JWT_SECRET || 'segredo';

router.post('/register', async (req, res) => {
  const { username, password, empresaId } = req.body;

  if (!empresaId) {
    return res.status(400).json({ message: 'empresaId é obrigatório' })
  }

  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ message: 'Usuário já existe' });

  const hashed = await bcrypt.hash(password, 10);
  const novo = new User({ username, password: hashed, empresaId });
  await novo.save();

  console.log(`Novo usuário criado: ${username} da empresa ${empresaId}`);
  res.status(201).json({ message: 'Usuário criado' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    console.log(`Tentativa de login com usuário inexistente: ${username}`);
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    console.log(`Senha incorreta para o usuário: ${username}`);
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ id: user._id, empresaId: user.empresaId }, SECRET, { expiresIn: '2h' });
  console.log(`Login bem-sucedido: ${username}`);
  res.json({ token });
});

module.exports = router;
