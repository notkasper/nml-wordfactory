const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const expressRateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const test = require('./routes/test');
const db = require('./db');

const start = async () => {
  const sequelize = await db.connect();
  await db.migrate(sequelize);

  const app = express();
  if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
  }

  // Body parser
  app.use(express.json());

  // Cookie parser
  app.use(cookieParser());

  // Security headers
  app.use(helmet());

  // Xss prevention
  app.use(xssClean());

  // Rate limiting
  app.use(
    expressRateLimit({
      windowMs: 1000 * 60 * 5,
      max: 100,
    }),
  );

  // Prevent http param pollution
  app.use(hpp());

  // CORS
  app.use(cors());

  // Set static folder (build folder)
  app.use(express.static(path.join(__dirname, './build')));

  app.use('/api/v1/test', test);

  const port = process.env.SERVER_PORT || 5000;

  const server = app.listen(port, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`));

  process.on('unhandledRejection', (error, promise) => {
    console.error(error);
    server.close(() => {
      process.exit(1);
    });
  });
};

start();
