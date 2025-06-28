import axios from 'axios';
import { Produto } from '../interfaces/produto.model';

// ------------------------
// 1. Backend próprio (Render + MongoDB)
// ------------------------
export const BACKEND_BASE_URL = 'https://projeto-whatsapp-a618.onrender.com/api';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
});

export const getProducts = async (): Promise<Produto[]> => {
  const response = await axios.get(`${BACKEND_BASE_URL}/produtos`, { headers: getAuthHeaders() });
  return response.data;
};

export const getProductById = async (id: string): Promise<Produto> => {
  const response = await axios.get(`${BACKEND_BASE_URL}/produtos/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

export const createProduct = async (product: Omit<Produto, '_id'>): Promise<Produto> => {
  const response = await axios.post(`${BACKEND_BASE_URL}/produtos`, product, { headers: getAuthHeaders() });
  return response.data;
};

export const updateProduct = async (id: string, product: Omit<Produto, '_id'>): Promise<Produto> => {
  const response = await axios.put(`${BACKEND_BASE_URL}/produtos/${id}`, product, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${BACKEND_BASE_URL}/produtos/${id}`, { headers: getAuthHeaders() });
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
export const enviarMensagemChat = async (mensagem: string): Promise<string> => {
  const response = await axios.post(
    `${BACKEND_BASE_URL}/chat`,
    {mensagem},
    {headers: getAuthHeaders()}
  );
  return response.data.resposta;
};