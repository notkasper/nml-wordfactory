const addDuration = (lessonAttempts) => {
  return lessonAttempts.map((lessonAttempt) => {
    const duration = lessonAttempt.questionGroupAttempts.reduce(
      (acc, curr) => acc + curr.timeElapsedSeconds,
      0
    );
    lessonAttempt.duration = Math.round(duration / 60);
    return lessonAttempt;
  });
};

const addPerformance = (lessonAttempts) => {
  return lessonAttempts.map((lessonAttempt) => {
    const { correct, incorrect } = lessonAttempt.questionGroupAttempts.reduce(
      (acc, curr) => {
        acc.correct += curr.correct;
        acc.incorrect += curr.incorrect + curr.missed;
        return acc;
      },
      { correct: 0, incorrect: 0 }
    );
    lessonAttempt.correct = correct;
    lessonAttempt.incorrect = incorrect;
    lessonAttempt.performance =
      Math.round((correct / (correct + incorrect)) * 100) / 10 || 0;
    return lessonAttempt;
  });
};

module.exports = { addDuration, addPerformance };
