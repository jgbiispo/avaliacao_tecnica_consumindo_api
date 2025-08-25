import express from 'express';
import paises from './routes';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import rateLimiter from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerSetup } from './swagger';

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());

app.use(express.json({ limit: '10kb' }));
app.use('/paises', paises, rateLimiter);

swaggerSetup(app);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
