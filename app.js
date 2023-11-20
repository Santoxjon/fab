const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

const indexRouter = require('./routes/index');
const matchesRouter = require('./routes/matches');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger.js');

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }', // Hide the top bar containing the "Authorize" button
};

app.use('/', indexRouter);
app.use('/matches', matchesRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

app.use((req, res) => {
  res.status(404).send({
    status: 404,
    errorCode: 'ENDPOINT_NOT_FOUND',
    message: 'Not Found',
  });
});

module.exports = app;
