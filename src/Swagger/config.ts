import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SocialMediaApp API',
    version: '1.0.0',
    description:
      'SocialMediaApp API documentation. <br><br>_If you want to test out the API please use <b>/v1/users/login</b> endpoint to log in as a test user first or just create your user with the <b>/v1/users/signup</b> endpoint._',
  },
  host: 'http://localhost:3005',
  basePath: '/v1',
};

const options = {
  swaggerDefinition,
  apis: ['./src/*/routes.ts'],
};

export const swaggerSpecification = swaggerJSDoc(options);
