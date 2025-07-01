require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

const client = twilio(accountSid, authToken);

async function enviarMensagemWhatsApp(to, body) {
    try {
        console.log('📤 Enviando mensagem para:', to, '| Texto:', body);

        const message = await client.messages.create({
            from: fromNumber,
            to: `whatsapp:${to}`,
            body,
        });
        console.log('Mensagem enviada. SID:', message.sid);
        return message;
    } catch (err) {
        console.error('Erro ao enviar mensagem:', err);
        throw err;
    }
}

module.exports = { enviarMensagemWhatsApp };
