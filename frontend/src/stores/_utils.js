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

const addQuestionGroupAverages = (lesson) => {
  lesson.questionGroups = lesson.questionGroups.map((questionGroup) => {
    const {
      correct,
      total,
      completions,
    } = questionGroup.questionGroupAttempts.reduce(
      (acc, curr) => {
        if (curr.isCompleted) {
          acc.correct += curr.correct;
          acc.total += curr.correct + curr.incorrect + curr.missed;
          acc.completions += 1;
        }
        return acc;
      },
      {
        correct: 0,
        total: 0,
        completions: 0,
      }
    );
    let averageScore = Math.round((correct / total) * 100) / 10;
    if (!averageScore) {
      averageScore = 0;
    }
    return { ...questionGroup, averageScore, completions };
  });

  return lesson;
};

export default { addDuration, addPerformance, addQuestionGroupAverages };
