const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const expressRateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
require('express-async-errors'); // catching async errors, that arent caught anywhere else, only needs to be required here

const authRouter = require('./routes/auth');
const lessonRouter = require('./routes/lesson');
const courseRouter = require('./routes/course');
const classRouter = require('./routes/class');
const studentRouter = require('./routes/students');
const db = require('./db');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const start = async () => {
  await db.initialize();

  const app = express();
  if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
  }

  // Body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

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
    })
  );

  // Prevent http param pollution
  app.use(hpp());

  // CORS
  app.use(cors());

  // Set static folder (build folder)
  app.use(express.static(path.join(__dirname, './build')));

  // Set API documentation path
  const swaggerDocument = YAML.load(
    path.join(__dirname, './swagger/swagger.yaml')
  );

  app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, {
      customCss: '.swagger-ui .topbar { display: none }',
    })
  );

  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/lessons', lessonRouter);
  app.use('/api/v1/courses', courseRouter);
  app.use('/api/v1/classes', classRouter);
  app.use('/api/v1/students', studentRouter);

  const port = process.env.SERVER_PORT || 5000;

  // MUST have all 4 of these parameters!
  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  });

  const server = app.listen(
    port,
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${port}`
    )
  );

  process.on('unhandledRejection', (error, promise) => {
    console.error(error);
    server.close(() => {
      process.exit(1);
    });
  });
};

start();
