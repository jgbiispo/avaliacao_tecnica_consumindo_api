import { NextFunction, Request, Response } from 'express';
import { CountryWithVotes } from '../types/country';
import { fetchByName } from '../services/restCountries';
import { mapCountry } from '../utils/mapCountry';
import { mergeVotes } from '../utils/mergeVotes';
import prisma from '../db';

export const searchCountryByName = async (
  req: Request,
  res: Response<CountryWithVotes[] | { erro: string }>,
  next: NextFunction
) => {
  const nome = (req.query.nome as string | undefined)?.trim();

  if (!nome) {
    const err = new Error('Invalid request body') as any;
    err.status = 400;
    return next(err);
  }

  try {
    const countries = await fetchByName(nome);

    if (countries.length === 0) {
      const err = new Error('Country not found') as any;
      err.status = 404;
      throw err;
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
    next(err);
  }
};
