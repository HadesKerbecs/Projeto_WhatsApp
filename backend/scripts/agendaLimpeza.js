const cron = require('node-cron');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'sample_mflix';
const COLLECTION_NAME = 'mensagens';

async function limparMensagensAntigas() {
  const client = new MongoClient(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // 3 dias atrás
    const tresDiasAtras = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    const resultado = await collection.deleteMany({
      data: { $lt: tresDiasAtras },
    });

    console.log(`🧹 Limpeza completa! Mensagens apagadas: ${resultado.deletedCount}`);
  } catch (err) {
    console.error('❌ Erro na limpeza de mensagens:', err);
  } finally {
    await client.close();
  }
}

// Executa diariamente às 2h da manhã
cron.schedule('0 2 * * *', () => {
  console.log('⏰ Executando limpeza diária de mensagens antigas...');
  limparMensagensAntigas();
});
