import express from 'express';
import top10Controller from './controllers/top10';
import { searchCountryByName } from './controllers/search';
import { evaluateCountry } from './controllers/EvaluateCountry';

const routes = express.Router();

routes.get('/health', (_req, res) => res.json({ ok: true }));

routes.get('/paises/top10', top10Controller);
routes.get('/paises/buscar', searchCountryByName);
routes.post('/paises/avaliar', evaluateCountry);

export default routes;
