import cron from 'node-cron';
import * as dotenv from 'dotenv'
import { MongoClient } from 'mongodb';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'sample_mflix';
const COLLECTION_NAME = 'mensagens';

async function limparMensagensAntigas() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const tresDiasAtras = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    const resultado = await collection.deleteMany({
      data: { $lt: tresDiasAtras.toISOString() }
    });

    console.log(`Mensagens apagadas: ${resultado.deletedCount}`);
  } catch (err) {
    console.error('Erro na limpeza de mensagens:', err);
  } finally {
    await client.close();
  }
}

// Agenda para rodar todo dia às 2h da manhã
cron.schedule('0 2 * * *', () => {
  console.log('Iniciando limpeza diária de mensagens antigas...');
  limparMensagensAntigas();
});
