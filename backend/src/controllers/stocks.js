const request = require('superagent');
const vader = require('vader-sentiment');

PUSSHIFT_BASE_URL = 'https://api.pushshift.io/reddit/submission/search';

const getBatch = async (ticker, before, after) => {
  console.log('Making request...');
  const response = await request
    .get(PUSSHIFT_BASE_URL)
    .query({ subreddit: 'stocks', q: ticker, fields: ['selftext', 'created_utc'], before, after, size: 500 });

  let newAfter = after;
  const batch = response.body.data.reduce((acc, post) => {
    if (post.selftext && post.selftext !== '[removed]') {
      const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(post.selftext);
      acc.push({
        ...post,
        intensity,
      });
    }
    if (post.created_utc > newAfter) {
      newAfter = post.created_utc;
    }
    return acc;
  }, []);

  return { batch, newAfter };
};

exports.queryStock = async (req, res) => {
  const { ticker } = req.params;
  console.log(`analyze: ${ticker}`);

  const now = new Date(Date.now());
  const before = Math.floor(now.getTime() / 1000);
  let after = Math.floor(new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).getTime() / 1000);
  postBuffer = [];
  let done = false;
  while (after < before && !done) {
    const { batch, newAfter } = await getBatch(ticker, before, after);
    if (newAfter == after) {
      done = true;
    }
    after = newAfter;
    postBuffer = postBuffer.concat(batch);
    console.log(`New after: ${after}`);
    console.log(`postBuffer contains ${postBuffer.length} posts`);
  }

  const data = {
    posts: postBuffer,
  };

  res.status(200).send({ data });
};
