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

    const nova = new Mensagem({ 
      cliente, 
      mensagem, 
      bot: false,
      status: 'enviando',  // status inicial
      data: new Date()
    });
    await nova.save();

    // Simula confirmação depois de 2s (trocar status para 'enviado')
    setTimeout(async () => {
      nova.status = 'enviado';
      await nova.save();
    }, 2000);

    res.status(201).json(nova);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao enviar mensagem' });
  }
};

