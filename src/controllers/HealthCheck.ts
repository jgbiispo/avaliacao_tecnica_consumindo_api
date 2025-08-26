import { NextFunction, Request, Response } from 'express';
import prisma from '../db';
import axios from 'axios';

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica status da API e serviços conectados
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Status de saúde da aplicação
 *       500:
 *         description: Algum serviço apresentou erro
 */
export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Testa conexão com o banco
    await prisma.$queryRaw`SELECT 1`;

    // Testa conexão com API externa (REST Countries)
    let restCountries = 'ok';
    try {
      await axios.get('https://restcountries.com/v3.1/all?fields=name');
    } catch (err) {
      restCountries = 'falha';
    }

    res.json({
      status: 'ok',
      api: 'rodando',
      database: 'ok',
      restCountries,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: 'erro',
      api: 'rodando',
      database: 'falha',
      restCountries: 'desconhecido',
      mensagem: (err as Error).message,
      timestamp: new Date().toISOString(),
    });
    next(err);
  }
};
