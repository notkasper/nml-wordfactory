const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const expressRateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const socketManager = require('./socketManager');
require('express-async-errors'); // catching async errors, that arent caught anywhere else, only needs to be required here

// routers
const authRouter = require('./routes/auth');
const lessonRouter = require('./routes/lesson');
const courseRouter = require('./routes/course');
const classRouter = require('./routes/class');
const studentRouter = require('./routes/students');
const lessonAttemptRouter = require('./routes/lessonAttempt');
const questionAttemptRouter = require('./routes/questionAttempt');
const questionGroupAttemptRouter = require('./routes/questionGroupAttempt');
const questionGroupRouter = require('./routes/questionGroup');
const questionRouter = require('./routes/question');

const db = require('./db');
const logger = require('./logger');
const hooks = require('./hooks/hooks');

const start = async () => {
  await db.initialize();
  await hooks.initialize();

  const app = express();
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Cookie parser
  app.use(cookieParser());

  // Security headers
  app.use(
    helmet({
      // Setting this options allows us to use inline javascript. By default Helmet does now allow this, but as we are a SPA this is required
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'", "'unsafe-inline'"],
        },
      },
    })
  );

  // Xss prevention
  app.use(xssClean());

  // Rate limiting (100 requests per minute)
  app.use(
    expressRateLimit({
      windowMs: 1000 * 60,
      max: 100,
    })
  );

  // Prevent http param pollution
  app.use(hpp());

  // CORS
  app.use(cors());

  // Set static folder (build folder)
  app.use('/', express.static(path.join(__dirname, './build')));

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
  app.use('/api/v1/lessonAttempts', lessonAttemptRouter);
  app.use('/api/v1/questionAttempts', questionAttemptRouter);
  app.use('/api/v1/questionGroupAttempts', questionGroupAttemptRouter);
  app.use('/api/v1/questionGroup', questionGroupRouter);
  app.use('/api/v1/question', questionRouter);

  const port = process.env.SERVER_PORT || 5000;

  // MUST have all 4 of these parameters!
  app.use((error, req, res, next) => {
    logger.error(error);
    res.status(500).send({ message: 'Server error' });
  });

  if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, './build/index.html'));
    });
  }

  const server = app.listen(
    port,
    logger.info(
      `Server running in ${process.env.NODE_ENV} mode on port ${port}`
    )
  );

  socketManager.init(server);

  process.on('unhandledRejection', (error, promise) => {
    logger.error(error);
    server.close(() => {
      process.exit(1);
    });
  });
};

start();
