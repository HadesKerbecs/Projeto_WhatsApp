const Mensagem = require('../models/mensagem');
const { enviarMensagemWhatsApp } = require('../services/twilioWhatsapp');

exports.listarMensagens = async (req, res) => {
  console.log('Listar mensagens chamada');
  try {
    const mensagens = await Mensagem.find({ empresaId: req.user.empresaId }).sort({ data: 1 });
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
      status: 'enviando',
      data: new Date(),
      empresaId: req.user.empresaId
    });

    await nova.save();

    // ✅ Enviar mensagem para o WhatsApp do cliente
    try {
      await enviarMensagemWhatsApp(cliente, mensagem);
      nova.status = 'enviado';
    } catch (twilioError) {
      console.error('Erro ao enviar pelo Twilio:', twilioError.message);
      nova.status = 'erro';
    }

    await nova.save();

    res.status(201).json(nova);
  } catch (err) {
    console.error('Erro ao enviar mensagem manual:', err);
    res.status(500).json({ message: 'Erro ao enviar mensagem' });
  }
};
