const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "FAB rest API",
      version: "1.0.0",
      description: "Rest API designed to query and scrap the FAB webpage",
    },
  },
  apis: ["routes/*.js"], // Path to the routes from the app.js not from here!
};

const specs = swaggerJsdoc(options);

module.exports = specs;
