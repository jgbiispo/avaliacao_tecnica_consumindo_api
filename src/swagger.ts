import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Catálogo de Países',
      version: '1.0.0',
      description: 'API para listar, buscar e avaliar países com votos',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsDoc(options);

export const swaggerSetup = (app: any) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
