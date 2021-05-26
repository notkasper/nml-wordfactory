const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const db = require('./db');
const logger = require('./logger');

const { stdin } = process;
stdin.setRawMode(true);
stdin.setEncoding('utf8');

console.log('Press the spacebar to insert new script');
console.log('Press Ctrl + Q to quit');

let counter = 0;
process.stdin.on('data', async (key) => {
  // press Ctrl + Q to quit the program: https://jkorpela.fi/chars/c0.html
  if (key === '\u0011') {
    process.exit();
  }

  // press space bar to insert some data
  if (key === '\u0020') {
    console.log('You pressed the spacebar!');

    counter += 1;
    console.log(`New counter is: ${counter}`);

    if (counter === 1) {
      logger.info('Seeding initialized');
      await db.initialize();

      await db.LessonAttempt.destroy({ where: {} });
      await db.QuestionAttempt.destroy({ where: {} });
      await db.QuestionGroupAttempt.destroy({ where: {} });

      logger.info('Seeding completed!');
    }

    if (counter === 2) {
      // TODO: implement
    }

    if (counter === 3) {
      // TODO: implement
    }
  }
});
