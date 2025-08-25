import express from 'express';
import prisma from './db';

const app = express();
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, service: 'catalogo-paises-api', db: 'up' });
  } catch {
    res
      .status(500)
      .json({ ok: false, service: 'catalogo-paises-api', db: 'down' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('DB conectado.');
  } catch (e) {
    console.error('Falha ao conectar no DB:', e);
  }
  console.log(`API rodando na porta ${PORT}`);
});
