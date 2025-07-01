const Mensagem = require('../models/mensagem');
const axios = require('axios');

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const CHATGPT_TOKEN = process.env.CHATGPT_TOKEN;

if (!CHATGPT_TOKEN) {
  console.error('⚠️ Erro: variável de ambiente CHATGPT_TOKEN não definida!');
}

function montarPrompt(produtos, pergunta) {
  const listaProdutos = produtos.map(p =>
    `- Nome: ${p.nome}, Preço: R$${p.preco.toFixed(2)}, Descrição: ${p.descricao}`
  ).join('\n');

  const systemPrompt = `
Você é um assistente de vendas que só pode responder usando as informações dos produtos listados abaixo.
Não invente produtos que não existem.
Se o cliente perguntar sobre algo que não está na lista, diga que não temos esse produto.

Produtos disponíveis:
${listaProdutos}
  `;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: pergunta }
  ];
}

exports.receberMensagem = async (req, res) => {
  console.log('=== Mensagem recebida no webhook ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  try {
    const novaMensagem = new Mensagem({
      cliente: req.body.WaId || 'desconhecido',
      mensagem: req.body.Body || '',
      bot: false,
      status: 'recebida',
      data: new Date(),
      empresaId: 'empresa-teste', // ajustar para dinamicamente
    });

    await novaMensagem.save();

    // Aqui você pode implementar chamada para GPT, envio resposta etc, se quiser

    res.status(200).send('<Response></Response>');
  } catch (err) {
    console.error('Erro ao salvar mensagem do webhook:', err);
    res.status(500).send('<Response></Response>');
  }
};

exports.listarMensagens = async (req, res) => {
  try {
    const mensagens = await Mensagem.find({ empresaId: req.user.empresaId }).sort({ data: 1 });
    res.json(mensagens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar mensagens' });
  }
};

exports.enviarMensagemManual = async (req, res) => {
  try {
    const { cliente, mensagem } = req.body;

    const nova = new Mensagem({
      cliente,
      mensagem,
      bot: true,
      status: 'enviando',
      data: new Date(),
      empresaId: req.user.empresaId,
    });
    await nova.save();

    // Pode adicionar integração para enviar via Twilio aqui

    nova.status = 'enviado';
    await nova.save();

    res.status(201).json(nova);
  } catch (err) {
    console.error('Erro ao enviar mensagem manual:', err);
    res.status(500).json({ message: 'Erro ao enviar mensagem' });
  }
};

exports.chatGPT = async (req, res) => {
  try {
    const { mensagem } = req.body;
    if (!mensagem) {
      return res.status(400).json({ message: "Mensagem é obrigatória" });
    }

    // Buscar produtos para o empresaId do usuário
    const produtos = await require('../models/product').find({ empresaId: req.user.empresaId });
    const messages = montarPrompt(produtos, mensagem);

    const response = await axios.post(
      CHATGPT_API_URL,
      { model: 'gpt-3.5-turbo', messages },
      { headers: { Authorization: `Bearer ${CHATGPT_TOKEN}`, 'Content-Type': 'application/json' } }
    );

    const resposta = response.data.choices[0].message.content;
    return res.json({ resposta });
  } catch (error) {
    if (error.response) {
      console.error('Erro na resposta da OpenAI:', error.response.data);
      return res.status(error.response.status || 500).json({ message: 'Erro na API da OpenAI', details: error.response.data });
    } else {
      console.error('Erro desconhecido:', error.message);
      return res.status(500).json({ message: 'Erro ao processar chat' });
    }
  }
};