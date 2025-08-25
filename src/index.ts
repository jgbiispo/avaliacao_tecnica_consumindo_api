import express from 'express';
import type { Request, Response } from 'express';
import { fetchAllCountries, fetchByName } from './services/restCountries';
import { mapCountry } from './utils/mapCountry';
import { CountryWithVotes } from './types/country';
import { mergeVotes } from './utils/mergeVotes';
import prisma from './db';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get(
  '/paises/top10',
  async (
    _req: Request,
    res: Response<CountryWithVotes[] | { erro: string }>
  ) => {
    try {
      const allCountries = await fetchAllCountries();

      const mapped = allCountries
        .map(mapCountry)
        .sort((a, b) => b.populacao - a.populacao)
        .slice(0, 10);

      const codes = mapped.map((c) => c.codigo);

      const votes = await prisma.countryVote.findMany({
        where: { codigo: { in: codes } },
      });

      const voteIndex = new Map(votes.map((v) => [v.codigo, v]));

      const result: CountryWithVotes[] = mapped.map((c) =>
        mergeVotes(c, voteIndex.get(c.codigo))
      );

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Falha ao listar top 10 países.' });
    }
  }
);

app.get(
  '/paises/buscar',
  async (
    req: Request,
    res: Response<CountryWithVotes[] | { erro: string }>
  ) => {
    const nome = (req.query.nome as string | undefined)?.trim();

    if (!nome) {
      return res.status(400).json({ erro: "Parâmetro 'nome' é obrigatório." });
    }

    try {
      const countries = await fetchByName(nome);

      if (countries.length === 0) {
        return res
          .status(404)
          .json({ erro: 'Nenhum país encontrado com esse nome.' });
      }

      const mapped = countries.map(mapCountry);

      const codes = mapped.map((c) => c.codigo);
      const votes = await prisma.countryVote.findMany({
        where: { codigo: { in: codes } },
      });
      const voteIndex = new Map(votes.map((v) => [v.codigo, v]));

      const result: CountryWithVotes[] = mapped.map((c) =>
        mergeVotes(c, voteIndex.get(c.codigo))
      );

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Falha ao buscar países.' });
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
