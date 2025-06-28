const axios = require('axios');
const Product = require('../models/product');

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const CHATGPT_TOKEN = process.env.CHATGPT_TOKEN;

if (!CHATGPT_TOKEN) {
  console.error('⚠️ Erro: variável de ambiente CHATGPT_TOKEN não definida!');
}

// Função para montar prompt com produtos
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

exports.chat = async (req, res) => {
  try {
    const { mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({ message: "Mensagem é obrigatória" });
    }

    // Buscar produtos no banco
    const produtos = await Product.find();

    // Montar mensagens para o GPT
    const messages = montarPrompt(produtos, mensagem);

    // Debug: mostrar prompt no console
    console.log('Prompt para OpenAI:', messages);

    // Chamada para API OpenAI
    const response = await axios.post(
      CHATGPT_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${CHATGPT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const resposta = response.data.choices[0].message.content;
    return res.json({ resposta });

  } catch (error) {
    if (error.response) {
      // Erro retornado pela OpenAI
      console.error('Erro na resposta da OpenAI:', error.response.data);
      // Enviar detalhe do erro no dev (cuidado em produção)
      return res.status(error.response.status || 500).json({
        message: 'Erro na API da OpenAI',
        details: error.response.data,
      });
    } else {
      // Erro genérico (ex: problemas de rede)
      console.error('Erro desconhecido:', error.message);
      return res.status(500).json({ message: 'Erro ao processar chat' });
    }
  }
};
