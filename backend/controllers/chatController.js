const axios = require('axios');
const Product = require('../models/product');

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const CHATGPT_TOKEN = process.env.CHATGPT_TOKEN; // Coloque no .env seu token da OpenAI

// Função para montar prompt com produtos
function montarPrompt(produtos, pergunta) {
  // Cria um texto resumo com produtos disponíveis
  const listaProdutos = produtos.map(p =>
    `- Nome: ${p.nome}, Preço: R$${p.preco.toFixed(2)}, Descrição: ${p.descricao}`
  ).join('\n');

  // Instrução para o ChatGPT
  const systemPrompt = `
Você é um assistente de vendas que só pode responder usando as informações dos produtos listados abaixo.
Não invente produtos que não existem.
Se o cliente perguntar sobre algo que não está na lista, diga que não temos esse produto.

Produtos disponíveis:
${listaProdutos}
  `;

  // Monta o array de mensagens para ChatGPT
  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: pergunta }
  ];
}

// Controller da rota POST /api/chat
exports.chat = async (req, res) => {
  try {
    const { mensagem } = req.body;

    if (!mensagem) return res.status(400).json({ message: "Mensagem é obrigatória" });

    // Busca produtos no banco
    const produtos = await Product.find();

    // Monta prompt com produtos e pergunta do usuário
    const messages = montarPrompt(produtos, mensagem);

    // Chamada para API OpenAI
    const response = await axios.post(CHATGPT_API_URL, {
      model: 'gpt-4o',  // ou 'gpt-3.5-turbo' se preferir algo mais barato
      messages,
    }, {
      headers: {
        Authorization: `Bearer ${CHATGPT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const resposta = response.data.choices[0].message.content;
    res.json({ resposta });

  } catch (error) {
    console.error('Erro no chat com ChatGPT:', error.response?.data || error.message);
    res.status(500).json({ message: 'Erro ao processar chat' });
  }
};
