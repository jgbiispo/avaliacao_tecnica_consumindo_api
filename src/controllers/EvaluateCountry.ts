import { Request, Response } from 'express';
import { EvaluateCountryRequest } from '../types/request';
import { fetchByCode } from '../services/restCountries';
import prisma from '../db';

export const evaluateCountry = async (
  req: Request<{}, {}, EvaluateCountryRequest>,
  res: Response
) => {
  const { code, action } = req.body;

  if (!code || (action !== 'like' && action !== 'dislike')) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    const countryData = await fetchByCode(code);

    if (!countryData) {
      return res.status(404).json({ message: 'Country not found' });
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
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
