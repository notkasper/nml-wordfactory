const request = require('superagent');
const { stdin } = process;
stdin.setRawMode(true);
stdin.setEncoding('utf8');

const stages = ['init', 'one', 'two', 'three'];
const makeRequest = async (stage) => {
  await request.post(`localhost:3000/api/v1/experiment/${stage}`);
};

(async () => {
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
      console.info('Attempting to push new data...');
      counter += 1;
      const stage = stages[counter];
      await makeRequest(stage);
      console.log('Data pushes successfully');
      if (counter >= 3) {
        process.exit();
      }
    }
  });
})();
