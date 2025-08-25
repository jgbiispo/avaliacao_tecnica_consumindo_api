import { NextFunction, Request, Response } from 'express';
import { EvaluateCountryRequest } from '../types/request';
import { fetchByCode } from '../services/restCountries';
import prisma from '../db';

/**
 * @swagger
 * /paises/avaliar:
 *   post:
 *     summary: Avalia um país (like/dislike)
 *     tags:
 *       - Países
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               action:
 *                 type: string
 *                 enum: [like, dislike]
 *     responses:
 *       200:
 *         description: País avaliado com sucesso
 *       400:
 *         description: Requisição inválida
 *       404:
 *         description: País não encontrado
 *       500:
 *         description: Erro interno
 */

export const evaluateCountry = async (
  req: Request<{}, {}, EvaluateCountryRequest>,
  res: Response,
  next: NextFunction
) => {
  const { code, action } = req.body;

  if (!code || (action !== 'like' && action !== 'dislike')) {
    const err = new Error('Invalid request body') as any;
    err.status = 400;
    throw err;
  }

  try {
    const countryData = await fetchByCode(code);

    if (!countryData) {
      const err = new Error('Country not found') as any;
      err.status = 404;
      throw err;
    }

    const updatedVote = await prisma.countryVote.upsert({
      where: { codigo: code },
      update: {
        likes: action === 'like' ? { increment: 1 } : undefined,
        dislikes: action === 'dislike' ? { increment: 1 } : undefined,
      },
      create: {
        codigo: code,
        likes: action === 'like' ? 1 : 0,
        dislikes: action === 'dislike' ? 1 : 0,
      },
    });

    const votosTotais = updatedVote.likes + updatedVote.dislikes;

    res.status(200).json({
      pais: countryData.name.common,
      status: 'sucesso',
      votosTotais,
    });
  } catch (error) {
    next(error);
  }
};
