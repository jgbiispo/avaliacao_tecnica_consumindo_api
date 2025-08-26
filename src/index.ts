import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import paises from './routes';
import rateLimiter from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerSetup } from './swagger';
import { healthCheck } from './controllers/HealthCheck';

// Constantes
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());

// Body parser com limite de 10kb
app.use(express.json({ limit: '10kb' }));

// Rotas
app.get('/health', healthCheck);
app.use('/paises', paises, rateLimiter);

// Documentação Swagger
swaggerSetup(app);

// Middleware de tratamento de erros
app.use(errorHandler);

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
