import { setGridPaginationModeActionCreator } from '@material-ui/data-grid';
//import questionAttempt from '../../backend/src/models/questionAttempt';

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

const addQuestionGroupStats = (questionGroup) => {
  let questionTitles = [];
  let questionIds = [];
  for (var i = 0; i < questionGroup.questions.length; i++) {
    questionTitles.push('Vraag ' + parseInt(i + 1));
    questionIds.push(questionGroup.questions[i].id);
  }
  questionGroup.questionTitles = questionTitles;
  questionGroup.questionIds = questionIds;

  return questionGroup;
};

const addQuestionGroupAttemptStats = (questionGroup, questionGroupAttempts) => {
  const { elapsedTime, total } = questionGroupAttempts.reduce(
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

const addquestionAttemptInformation = (
  questionAttemptID,
  questionGroupAttempts,
  questions,
  lessonAttempts,
  students,
  questionGroupName
) => {
  const questionGroupAttemptId = questionAttemptID.questionGroupAttemptId;
  let lessonAttemptId = null;
  questionGroupAttempts.map((questionGroupAttempt) => {
    if (questionGroupAttempt.id == questionGroupAttemptId) {
      lessonAttemptId = questionGroupAttempt.lessonAttemptId;
    }
  });
  let studentId = null;
  lessonAttempts.map((lessonAttempt) => {
    if (lessonAttempt.id == lessonAttemptId) {
      studentId = lessonAttempt.studentId;
    }
  });
  let studentName = null;
  students.map((student) => {
    if (student.id == studentId) {
      studentName = student.name;
    }
  });

  let question = null;

  questions.map((q) => {
    if (q.id == questionAttemptID.questionId) {
      question = q;
    }
  });
  questionAttemptID.studentId = studentId;
  questionAttemptID.studentName = studentName;
  questionAttemptID.questionGroupAttemptId = questionGroupAttemptId;
  questionAttemptID.lessonAttemptId = lessonAttemptId;
  questionAttemptID.question = question;
  questionAttemptID.questionGroupName = questionGroupName;
  return questionAttemptID;
};

const addQuestionAttemptsStats = (questionGroup) => {
  const questionIds = questionGroup.questionIds;
  let answers = []; //Array(questionIds.length).fill(0);
  for (var i = 0; i < questionIds.length; i++) {
    answers.push([]);
  }

  questionGroup.questionAttempts.map((qa) => {
    const questionId = qa.questionId;
    const index = questionIds.findIndex((id) => id == questionId);

    let answer = qa.content;

    answers[index].push(answer);
  });
  questionGroup.answers = answers;
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

export default {
  addDuration,
  addPerformance,
  addQuestionGroupAverages,
  addQuestionGroupAttemptStats,
  addQuestionGroupStats,
  addquestionAttemptInformation,
  addQuestionAttemptsStats,
};

const utils = {
  addDuration,
  addPerformance,
  addQuestionGroupAverages,
};

export default utils;

