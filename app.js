/* eslint-disable no-console */
/**
 * Now body-parser are inside of express package
 *
 * */

/**
 * reading environment
 *
 * */
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// const path = require('path');

const mongoose = require('mongoose');

const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const { errors } = require('celebrate');
const { errorLogger, requestLogger } = require('./middleware/logger');

// include these before other routes

const routes = require('./routes');

const { APP_STATE, errorHandler } = require('./helpers/constants');

const NotFoundError = require('./errors/NotFoundError');

const {
  PORT = 3000,
  NODE_ENV = 'test',
  MONGO_LINK = 'mongodb://localhost:27017/finalproj1',
} = process.env;

const app = express();
app.use(cors());
app.options('*', cors()); // enable requests for all routes

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

// connect to the MongoDB server
mongoose.connect(MONGO_LINK, {});
// Now mongodb have no need in launch options / parameters ↑

app.disable('x-powered-by');

app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: '_',
  })
);

// app.use(express.static(path.join(__dirname, 'public')));
app.use(requestLogger);

app.use(limiter);

app.use(routes);

// remove this later ↓
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use('/', (req, res, next) => {
  next(
    new NotFoundError(
      APP_STATE.HTTP_NO_SUCH_ROUTE.MESSAGE,
      APP_STATE.HTTP_NO_SUCH_ROUTE.STATUS
    )
  );
});

app.use(errorLogger);

// celebrate error handler ↓
app.use(errors());

app.use(errorHandler);

if (NODE_ENV !== 'test') {
  app.listen(PORT);
} else {
  app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT} `);
  });
}
