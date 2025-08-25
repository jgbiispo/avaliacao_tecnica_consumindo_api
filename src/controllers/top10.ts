import { NextFunction, Request, Response } from 'express';
import { CountryWithVotes } from '../types/country';
import { fetchAllCountries } from '../services/restCountries';
import { mapCountry } from '../utils/mapCountry';
import prisma from '../db';
import { mergeVotes } from '../utils/mergeVotes';

/**
 * @swagger
 * /paises/top10:
 *   get:
 *     summary: Lista os 10 países mais populosos
 *     tags:
 *       - Países
 *     responses:
 *       200:
 *         description: Lista de países com votos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nome:
 *                     type: string
 *                   populacao:
 *                     type: number
 *                   continente:
 *                     type: string
 *                   codigo:
 *                     type: string
 *                   likes:
 *                     type: number
 *                   dislikes:
 *                     type: number
 *                   votosTotais:
 *                     type: number
 *       500:
 *         description: Erro interno
 */

const top10Controller = async (
  _req: Request,
  res: Response<CountryWithVotes[] | { erro: string }>,
  next: NextFunction
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
    next(err);
  }
};

export default top10Controller;
