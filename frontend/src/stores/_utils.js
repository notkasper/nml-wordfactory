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

    const unroundedGrade = ((correct / (correct + incorrect)) * 100) / 10;

    // unroundedGrade could be NaN if both correct and incorrect are 0
    lessonAttempt.performance = Math.max(1, Math.round(unroundedGrade || 1));
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

const addQuestionAttemptInformation = (questionGroup) => {
  const questionType = questionGroup.questions[0].type;
  if (!questionType || questionType !== 'multipleChoice') {
    return questionGroup;
  }

  let answers = [];
  questionGroup.questions.forEach((q) => {
    answers.push(q.data.options);
  });
  let answer = null;
  let correct = null;

  let acc = 0;
  questionGroup.questionGroupAttempts.forEach((qga) => {
    const studentName = qga.lessonAttempts.student.name;
    const studentId = qga.lessonAttempts.student.id;

    qga.questionAttempts.forEach((qa) => {
      const answerAttempt = qa.content;
      if (answerAttempt.length !== 0) {
        answer =
          answers[acc % qga.questionAttempts.length][answerAttempt].value;

        if (
          answers[acc % qga.questionAttempts.length][answerAttempt].isCorrect
        ) {
          correct = true;
        } else {
          correct = false;
        }
      } else {
        correct = false;
        answer = '';
      }

      qa.studentName = studentName;
      qa.studentId = studentId;
      qa.answer = answer;
      qa.correct = correct;
    });
    acc += 1;
  });

  return questionGroup;
};

const addQuestionGroupAverages = (lesson, questionGroup) => {
  lesson.questionGroups = lesson.questionGroups.map((questionGroup) => {
    const { correct, total, completions } =
      questionGroup.questionGroupAttempts.reduce(
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

const utils = {
  addDuration,
  addPerformance,
  addQuestionGroupAverages,
  addQuestionGroupAttemptStats,
  addQuestionAttemptInformation,
};

export default utils;
