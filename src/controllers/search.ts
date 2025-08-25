import { Request, Response } from 'express';
import { CountryWithVotes } from '../types/country';
import { fetchByName } from '../services/restCountries';
import { mapCountry } from '../utils/mapCountry';
import { mergeVotes } from '../utils/mergeVotes';
import prisma from '../db';

export const searchCountryByName = async (
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
};
