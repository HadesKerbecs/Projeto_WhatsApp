const Mensagem = require('../models/mensagem');
const axios = require('axios');
const Product = require('../models/product');

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const CHATGPT_TOKEN = process.env.CHATGPT_TOKEN;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;

if (!CHATGPT_TOKEN || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
  console.error('⚠️ Variáveis de ambiente faltando! Verifique CHATGPT_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM.');
}

function montarPrompt(produtos, pergunta) {
  const listaProdutos = produtos.map(p =>
    `- Nome: ${p.nome}, Preço: R$${p.preco.toFixed(2)}, Descrição: ${p.descricao}`
  ).join('\n');

  const systemPrompt = `
Você é um assistente de vendas que só pode responder usando as informações dos produtos listados abaixo.
Não invente produtos que não existem.
Se o cliente perguntar sobre algo que não está na lista, diga que não temos esse produto.
Só forneça preço e descrição se o usuário pedir detalhes de um produto específico.

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
  console.log('Body:', req.body);

  try {
    const mensagemCliente = req.body.Body || '';
    const numeroCliente = req.body.WaId || 'desconhecido';

    // Salvar mensagem do cliente no banco
    const novaMensagem = new Mensagem({
      cliente: numeroCliente,
      mensagem: mensagemCliente,
      bot: false,
      status: 'recebida',
      data: new Date(),
      empresaId: 'empresa-teste', // vai ser dinâmico depois
    });
    await novaMensagem.save();

    // Buscar últimos 5 diálogos anteriores com esse cliente
    const historico = await Mensagem.find({ cliente: numeroCliente })
      .sort({ data: -1 })
      .limit(5)
      .lean();

    // Reverter para ordem cronológica
    const historicoOrdenado = historico.reverse();

    // Buscar produtos da empresa
    const produtos = await Product.find({ empresaId: 'empresa-teste' });

    const listaProdutos = produtos.map(p =>
      `- Nome: ${p.nome}, Preço: R$${p.preco.toFixed(2)}, Descrição: ${p.descricao}`
    ).join('\n');

    const mensagensContexto = [
      {
        role: 'system',
        content: `
Você é um assistente de vendas que responde usando apenas os produtos listados abaixo.
Se o cliente perguntar sobre algo que não está na lista, diga que não temos esse item.
Só forneça preço e descrição se o cliente pedir detalhes.

Produtos disponíveis:
${listaProdutos}
        `.trim(),
      },
      ...historicoOrdenado.map(msg => ({
        role: msg.bot ? 'assistant' : 'user',
        content: msg.mensagem,
      })),
      {
        role: 'user',
        content: mensagemCliente,
      },
    ];

    // Enviar para o ChatGPT
    const respostaGPT = await axios.post(
      CHATGPT_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: mensagensContexto,
      },
      {
        headers: {
          Authorization: `Bearer ${CHATGPT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const resposta = respostaGPT.data.choices[0].message.content;

    // Salvar resposta do bot
    const mensagemBot = new Mensagem({
      cliente: numeroCliente,
      mensagem: resposta,
      bot: true,
      status: 'enviado',
      data: new Date(),
      empresaId: 'empresa-teste',
    });
    await mensagemBot.save();

    // Enviar via Twilio
    await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        From: TWILIO_WHATSAPP_FROM,
        To: `whatsapp:+${numeroCliente}`,
        Body: resposta,
      }),
      {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return res.status(200).send('<Response></Response>');
  } catch (err) {
    console.error('❌ Erro ao processar webhook:', err.response?.data || err.message);
    return res.status(500).send('<Response></Response>');
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