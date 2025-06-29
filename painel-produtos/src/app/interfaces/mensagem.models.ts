export type StatusMensagem = 'enviando' | 'enviado' | 'entregue' | 'lida';

export interface Mensagem {
  cliente: string;
  mensagem: string;
  bot: boolean;
  data: string;
  status: StatusMensagem;
}
