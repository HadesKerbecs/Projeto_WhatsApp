import axios from 'axios';
import { Produto } from '../interfaces/produto.model';

// ------------------------
// 1. Backend próprio (Render + MongoDB)
// ------------------------
const BACKEND_BASE_URL = 'https://projeto-whatsapp-a618.onrender.com/api';
const backendHeaders = {
  'Content-Type': 'application/json',
  // Se usar autenticação JWT, adiciona aqui:
  // Authorization: `Bearer ${SEU_TOKEN}`,
};

export const getProducts = async (): Promise<Produto[]> => {
  const response = await axios.get(`${BACKEND_BASE_URL}/produtos`, { headers: backendHeaders });
  return response.data;
};

export const getProductById = async (id: string): Promise<Produto> => {
  const response = await axios.get(`${BACKEND_BASE_URL}/produtos/${id}`, { headers: backendHeaders });
  return response.data;
};

export const createProduct = async (product: Omit<Produto, 'id'>): Promise<Produto> => {
  const response = await axios.post(`${BACKEND_BASE_URL}/produtos`, product, { headers: backendHeaders });
  return response.data;
};

export const updateProduct = async (id: string, product: Omit<Produto, 'id'>): Promise<Produto> => {
  const response = await axios.put(`${BACKEND_BASE_URL}/produtos/${id}`, product, { headers: backendHeaders });
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${BACKEND_BASE_URL}/produtos/${id}`, { headers: backendHeaders });
};

// ------------------------
// 2. API do WhatsApp
// ------------------------
const WHATSAPP_BASE_URL = 'https://api.whatsapp.com/v1'; // Troque pela URL correta da sua API WhatsApp
const WHATSAPP_TOKEN = 'SEU_TOKEN_WHATSAPP';

const whatsappHeaders = {
  Authorization: `Bearer ${WHATSAPP_TOKEN}`,
  'Content-Type': 'application/json',
};

export const sendWhatsAppMessage = async (to: string, message: string) => {
  const body = {
    to,
    type: 'text',
    text: { body: message },
  };

  const response = await axios.post(`${WHATSAPP_BASE_URL}/messages`, body, {
    headers: whatsappHeaders,
  });

  return response.data;
};

// ------------------------
// 3. API do ChatGPT
// ------------------------
const CHATGPT_BASE_URL = 'https://api.openai.com/v1/chat/completions';
const CHATGPT_TOKEN = 'SEU_TOKEN_CHATGPT';

const chatGptHeaders = {
  Authorization: `Bearer ${CHATGPT_TOKEN}`,
  'Content-Type': 'application/json',
};

export const getChatGptResponse = async (messages: any[]) => {
  const body = {
    model: 'gpt-4o', // Ajuste conforme sua subscrição
    messages,
  };

  const response = await axios.post(CHATGPT_BASE_URL, body, {
    headers: chatGptHeaders,
  });

  return response.data.choices[0].message;
};