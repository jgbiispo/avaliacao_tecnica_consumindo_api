import { Request, Response, NextFunction } from 'express';

interface ApiError extends Error {
  status?: number;
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response<{ erro: string }>,
  next: NextFunction
) {
  console.error(`[ERRO] ${req.method} ${req.url}`, err);

  const status = err.status ?? 500;
  const message = err.message || 'Ocorreu um erro interno no servidor.';

  res.status(status).json({ erro: message });
}
