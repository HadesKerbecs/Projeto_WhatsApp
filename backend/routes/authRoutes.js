const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const SECRET = process.env.JWT_SECRET || 'segredo';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ message: 'Usuário já existe' });

  const hashed = await bcrypt.hash(password, 10);
  const novo = new User({ username, password: hashed });
  await novo.save();
  res.status(201).json({ message: 'Usuário criado' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '2h' });
  res.json({ token });
});

module.exports = router;
