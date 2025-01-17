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

    // unroundedGrade could be NaN if both correct and incorrect are 0
    const total = correct + incorrect;
    const performance = Math.min(
      Math.round((correct / total || 0) * 9 + 1),
      10
    );
    lessonAttempt.performance = performance;

    return lessonAttempt;
  });
};

const addQuestionGroupAttemptStats = (questionGroup) => {
  const { elapsedTime, total } = questionGroup.questionGroupAttempts.reduce(
    (acc, curr) => {
      if (curr.isCompleted) {
        acc.elapsedTime += curr.timeElapsedSeconds;
        acc.total += 1;
      }
      return acc;
    },
    { elapsedTime: 0, total: 0 }
  );

  questionGroup.averageElapsedTime = Math.round(elapsedTime / total);
  return questionGroup;
};

const addInformation = (questionAttempts) => {
  questionAttempts.forEach((qa) => {
    const answers = [];
    let answerAttempt = '';
    let correct = 0;
    let incorrect = 0;
    let missed = 0;
    const correctAnswers = [];
    if (qa.question.type === 'multipleChoice') {
      qa.question.data.options.forEach((q, index) => {
        answers.push(q.value);
        if (q.isCorrect) {
          correctAnswers.push(index);
        }
      });

      if (qa.content !== []) {
        qa.content.forEach((attempt, index) => {
          if (correctAnswers.includes(attempt)) {
            correct += 1;
          } else {
            incorrect += 1;
          }
          answerAttempt += answers[index];
        });
        missed += correctAnswers.length - qa.content.length;
      } else {
        answerAttempt = qa.content;
        correct = incorrect = missed = 0;
      }
    } else {
      answerAttempt = qa.content;
    }
    qa.correct = correct;
    qa.incorrect = incorrect;
    qa.missed = missed;
    qa.answer = answerAttempt;
  });
  return questionAttempts;
};

const addQuestionAttemptInformation = (questionGroup) => {
  const questionType = questionGroup.questions[0].type;
  if (!questionType || questionType !== 'multipleChoice') {
    return questionGroup;
  }

  const answers = [];
  questionGroup.questions.forEach((q) => {
    answers.push(q.data.options);
  });

  let acc = 0;
  questionGroup.questionGroupAttempts.forEach((qga) => {
    if (qga.isCompleted) {
      qga.questionAttempts.forEach((qa) => {
        let correct = 0;
        let incorrect = 0;
        let missed = 0;
        let answer = '';
        const answerAttempt = qa.content;
        if (answerAttempt.length !== 0) {
          for (
            let j = 0;
            j < answers[acc % qga.questionAttempts.length].length;
            j++
          ) {
            const isCorrect =
              answers[acc % qga.questionAttempts.length][j].isCorrect;
            const value = answers[acc % qga.questionAttempts.length][j].value;
            if (answerAttempt.includes(j)) {
              answer += value + ', ';
              if (isCorrect) {
                correct += 1;
              } else {
                incorrect += 1;
              }
            } else if (!answerAttempt.includes(j) && isCorrect) {
              missed += 1;
            }
          }
        } else {
          missed += 1;
        }

        qa.answer = answer.slice(0, -2); //Remove last comma and whitespace
        qa.correct = correct;
        qa.incorrect = incorrect;
        qa.missed = missed;
      });
      acc += 1;
    }
  });

  return questionGroup;
};

const addQuestionGroupAverages = (lesson, questionGroup) => {
  lesson.questionGroups = lesson.questionGroups.map((questionGroup) => {
    const { correct, total, completions, elapsedTime } =
      questionGroup.questionGroupAttempts.reduce(
        (acc, curr) => {
          if (curr.isCompleted) {
            acc.correct += curr.correct;
            acc.total += curr.correct + curr.incorrect + curr.missed;
            acc.completions += 1;
            acc.elapsedTime += curr.timeElapsedSeconds;
          }
          return acc;
        },
        {
          correct: 0,
          total: 0,
          completions: 0,
          elapsedTime: 0,
        }
      );
    let averageScore = Math.round((correct / total) * 100) / 10;
    if (!averageScore) {
      averageScore = 0;
    }
    let averageElapsedTime = Math.round(elapsedTime / completions);
    if (!averageElapsedTime) {
      averageElapsedTime = 0;
    }

    return { ...questionGroup, averageScore, completions, averageElapsedTime };
  });

  return lesson;
};

const utils = {
  addDuration,
  addPerformance,
  addInformation,
  addQuestionAttemptInformation,
  addQuestionGroupAverages,
  addQuestionGroupAttemptStats,
};

export default utils;
