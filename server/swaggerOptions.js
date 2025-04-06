// swaggerOptions.js
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'MERN Stack Project API',
        version: '1.0.0',
        description: 'API documentation for MERN Stack App',
      },
      servers: [
        {
          url: 'http://localhost:5000/api',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    apis: ['./routes/*.js'], // adjust this if your routes are in a different folder
  };
  
  module.exports = options;
  
