import { setGridPaginationModeActionCreator } from '@material-ui/data-grid';

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

const addQuestionGroupStats = (questionGroup) => {
  let questionTitles = [];
  for (var i = 0; i < questionGroup.questions.length; i++) {
    questionTitles.push('Vraag ' + parseInt(i + 1));
  }
  questionGroup.questionTitles = questionTitles;
  return questionGroup;
};
const addQuestionGroupAttemptStats = (questionGroup, questionGroupAttempts) => {
  const amountLessons = questionGroup.questions.length;

  const { elapsedTime } = questionGroupAttempts.reduce(
    (acc, curr) => {
      if (curr.isCompleted) {
        acc.elapsedTime += curr.timeElapsedSeconds;
      }
      return acc;
    },
    { elapsedTime: 0 }
  );
  questionGroup.averageElapsedTime = elapsedTime / amountLessons; //totaal aantal
  return questionGroup;
};

const addQuestionGroupAverages = (lesson, questionGroup) => {
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

export default {
  addDuration,
  addPerformance,
  addQuestionGroupAverages,
  addQuestionGroupAttemptStats,
  addQuestionGroupStats,
};
