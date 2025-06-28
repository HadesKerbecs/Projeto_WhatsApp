const Mensagem = require('../models/mensagem');
const axios = require('axios'); // para envio via API WhatsApp se quiser

exports.listarMensagens = async (req, res) => {
  console.log('Listar mensagens chamada');
  try {
    const mensagens = await Mensagem.find().sort({ data: 1 });
    res.json(mensagens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar mensagens' });
  }
};

exports.enviarMensagem = async (req, res) => {
  try {
    const { cliente, mensagem } = req.body;

    // Aqui você pode chamar a API da Meta para enviar pelo WhatsApp se quiser

    const nova = new Mensagem({ cliente, mensagem, bot: false });
    await nova.save();

    res.status(201).json(nova);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao enviar mensagem' });
  }
};
