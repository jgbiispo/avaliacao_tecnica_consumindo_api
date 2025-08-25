import express from 'express';
import { fetchAllCountries, fetchByName } from './services/restCountries';
import { mapCountry } from './utils/mapCountry';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/test/countries', async (_req, res) => {
  const all = await fetchAllCountries();
  const mapped = all.map(mapCountry).slice(0, 10); // só os 10 primeiros
  res.json(mapped);
});

app.get('/test/search', async (req, res) => {
  const nome = (req.query.nome as string) || 'brasil';
  const results = await fetchByName(nome);
  const mapped = results.map(mapCountry);
  res.json(mapped);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
