const express = require('express');
require('dotenv').config();

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const scheduler = require('./schedulers/nextMatch.scheduler');
const fs = require('fs');
const https = require('https');
const debug = require('debug')('fab:server');
const axios = require('axios');

const app = express();
let credentials = null;
try {
  const privateKey = fs.readFileSync('ssl/privkey1.pem', 'utf8');
  const certificate = fs.readFileSync('ssl/cert1.pem', 'utf8');
  const ca = fs.readFileSync('ssl/chain1.pem', 'utf8');

  credentials = {
    key: privateKey,
    cert: certificate,
    ca,
  };
} catch (err) {
  console.error('Error reading file:', err);
}

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});
const onListening = () => {
  const addr = httpsServer.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
};
httpsServer.on('listening', onListening);
console.log(process.cwd());

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

const IP2LOCATION_API_URL = process.env.IP2LOCATION_API_URL;
const IP2LOCATION_API_TOKEN = process.env.IP2LOCATION_API_TOKEN;

app.use((req, res, next) => {
  try {
    if (req.ip === '::1') return next(); // Skip if localhost
    const clientIp = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
    axios
      .get(
        `${IP2LOCATION_API_URL}/?key=${IP2LOCATION_API_TOKEN}&ip=${clientIp}&format=json`
      )
      .then((response) => {
        console.log(
          'Conexión desde:',
          response.data.ip,
          'en',
          response.data.city_name
        );
      });
  } catch (err) {
    console.error('Error getting client IP:', err);
  }
  next();
});

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

// scheduler.updateNextMatchCache();
// scheduler.dailyUpdate();

module.exports = app;
