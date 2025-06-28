export interface Mensagem {
    _id?: string,
    cliente: string;
    mensagem: string;
    bot: boolean;
    data: string;
}