import express from 'express';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerSetup } from './swagger';

const app = express();
app.use(express.json());
app.use(routes);
swaggerSetup(app);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
