import { Request, Response } from 'express';
import { CountryWithVotes } from '../types/country';
import { fetchAllCountries } from '../services/restCountries';
import { mapCountry } from '../utils/mapCountry';
import prisma from '../db';
import { mergeVotes } from '../utils/mergeVotes';

const top10Controller = async (
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
};

export default top10Controller;
