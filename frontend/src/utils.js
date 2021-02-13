const currentWeekNumber = require('current-week-number');

exports.clusterWeekly = (posts) => {
  const buffer = {};
  posts.forEach((post) => {
    const weekNr = currentWeekNumber(new Date(post.created_utc * 1000));
    if (!buffer[weekNr]) {
      buffer[weekNr] = { posts: [], intensity: { pos: 0, neg: 0, neu: 0, compound: 0 } };
    }
    buffer[weekNr].posts.push(post);
    buffer[weekNr].intensity.pos += post.intensity.pos;
    buffer[weekNr].intensity.neg += post.intensity.neg;
    buffer[weekNr].intensity.neu += post.intensity.neu;
    buffer[weekNr].intensity.compound += post.intensity.compound;
  });
  Object.keys(buffer).forEach((weekNr) => {
    const amount = buffer[weekNr].posts.length;
    buffer[weekNr].intensity.pos = buffer[weekNr].intensity.pos / amount;
    buffer[weekNr].intensity.neg = buffer[weekNr].intensity.neg / amount;
    buffer[weekNr].intensity.neu = buffer[weekNr].intensity.neu / amount;
    buffer[weekNr].intensity.compound = buffer[weekNr].intensity.compound / amount;
  });
  return buffer;
};
