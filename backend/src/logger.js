const bunyan = require('bunyan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const PrettyStream = require('bunyan-prettystream');

const package = require('../package.json');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const mode = process.env.NODE_ENV === 'production' ? 'long' : 'short';
const prettyStream = new PrettyStream({ mode });
prettyStream.pipe(process.stdout);

const productionLogFolder = path.join(__dirname, '../../logs');
if (!fs.existsSync(productionLogFolder)) {
  fs.mkdirSync(productionLogFolder);
}

const productionStream = {
  type: 'rotating-file',
  path: path.join(productionLogFolder, '/production.log'),
  period: '1d',
  count: 14,
};

const developmentStream = {
  level: 'debug',
  type: 'raw',
  stream: prettyStream,
};

const logger = bunyan.createLogger({
  name: package.name,
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  streams: [
    process.env.NODE_ENV === 'production'
      ? productionStream
      : developmentStream,
  ],
});

module.exports = logger;
