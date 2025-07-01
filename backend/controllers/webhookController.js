const Mensagem = require('../models/mensagem');
const axios = require('axios');
const Product = require('../models/product');
const Cliente = require('../models/cliente');

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
  const mensagemCliente = req.body.Body || '';
  const numeroCliente = req.body.WaId || 'desconhecido';

  try {
    // 🔍 Buscar empresa do número que mandou mensagem
    const clienteDB = await Cliente.findOne({ numero: numeroCliente });

    if (!clienteDB) {
      console.warn('Número ainda não cadastrado:', numeroCliente);
      return res.status(403).send('<Response>Cliente não reconhecido</Response>');
    }

    const empresaId = clienteDB.empresaId;

    // 💾 Salvar mensagem recebida
    const novaMensagem = new Mensagem({
      cliente: numeroCliente,
      mensagem: mensagemCliente,
      bot: false,
      status: 'recebida',
      data: new Date(),
      empresaId,
    });
    await novaMensagem.save();

    // 🔁 Buscar histórico do mesmo cliente
    const historico = await Mensagem.find({ cliente: numeroCliente }).sort({ data: -1 }).limit(5).lean();
    const historicoOrdenado = historico.reverse();

    // 📦 Buscar produtos da empresa
    const produtos = await Product.find({ empresaId });

    // 🧠 Montar contexto
    const mensagensContexto = [
      {
        role: 'system',
        content: `
Você é um assistente de vendas que responde com base apenas nesses produtos:
${produtos.map(p => `- ${p.nome}, R$${p.preco.toFixed(2)}, ${p.descricao}`).join('\n')}
        `.trim()
      },
      ...historicoOrdenado.map(m => ({
        role: m.bot ? 'assistant' : 'user',
        content: m.mensagem,
      })),
      { role: 'user', content: mensagemCliente }
    ];

    // 🔁 Resposta do GPT
    const respostaGPT = await axios.post(CHATGPT_API_URL, {
      model: 'gpt-3.5-turbo',
      messages: mensagensContexto,
    }, {
      headers: {
        Authorization: `Bearer ${CHATGPT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const resposta = respostaGPT.data.choices[0].message.content;

    // 💾 Salvar resposta do bot
    await new Mensagem({
      cliente: numeroCliente,
      mensagem: resposta,
      bot: true,
      status: 'enviado',
      data: new Date(),
      empresaId
    }).save();

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
    console.error('Erro no webhook:', err);
    return res.status(500).send('<Response>Erro interno</Response>');
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