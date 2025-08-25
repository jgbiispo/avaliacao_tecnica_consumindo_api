import express from 'express';
import top10Controller from './controllers/top10';
import { searchCountryByName } from './controllers/search';

const routes = express.Router();

routes.get('/health', (_req, res) => res.json({ ok: true }));

routes.get('/paises/top10', top10Controller);
routes.get('/paises/buscar', searchCountryByName);

export default routes;
