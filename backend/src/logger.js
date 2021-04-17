const bunyan = require('bunyan');
const path = require('path');
const fs = require('fs');
const PrettyStream = require('bunyan-prettystream');

const package = require('../package.json');

const mode = process.env.NODE_ENV === 'production' ? 'long' : 'short';
const prettyStream = new PrettyStream({ mode });
prettyStream.pipe(process.stdout);

const productionLogFolder = path.join(__dirname, '../../logs');
if (!fs.existsSync(productionLogFolder)) {
  fs.mkdirSync(productionLogFolder);
}

const productionStream = {
  level: 'debug',
  type: 'raw',
  stream: prettyStream,
};

const developmentStream = {
  level: 'debug',
  type: 'raw',
  stream: prettyStream,
};

const logger = bunyan.createLogger({
  name: package.name,
  level: 'info',
  streams: [
    process.env.NODE_ENV === 'production'
      ? productionStream
      : developmentStream,
  ],
});

module.exports = logger;
