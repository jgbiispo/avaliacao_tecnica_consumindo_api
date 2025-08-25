import express from 'express';
import top10Controller from './controllers/top10';
import { searchCountryByName } from './controllers/search';
import { evaluateCountry } from './controllers/EvaluateCountry';

const routes = express.Router();

routes.get('/health', (_req, res) => res.json({ ok: true }));

routes.get('/top10', top10Controller);

routes.get('/buscar', searchCountryByName);

routes.post('/avaliar', evaluateCountry);

export default routes;
