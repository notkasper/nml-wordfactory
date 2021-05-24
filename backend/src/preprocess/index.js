const fs = require('fs');
const uuid = require('uuid');
const _ = require('lodash');
const { encryptPassword } = require('../_utils');
const {
  convertQuestionItemToAnswer,
  convertFormatToQuestions,
  getScoreFromQuestion,
} = require('./conversion');

const wordfactoryExport = require('../../wordfactory-export.json');

const splitToChunks = (array, parts) => {
  const result = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
};

const preprocessedData = {};

(async () => {
  const uniqueUsernames = _.uniqBy(wordfactoryExport, (e) => e.user.name);
  const splitUniqueUsernames = splitToChunks(uniqueUsernames, 3);

  const teacher = {
    id: uuid.v4(),
    role: 'teacher',
    name: 'superuser',
    email: 'super@user.nl',
    passwordEncrypted: await encryptPassword('superuser'),
  };

  preprocessedData.classes = [];
  const educationLevels = ['MAVO', 'HAVO', 'VWO'];

  for (let classIndex = 0; classIndex < 3; classIndex += 1) {
    const students = [];
    for (const uniqueUsername of splitUniqueUsernames[classIndex]) {
      students.push({
        id: uuid.v4(),
        role: 'student',
        name: uniqueUsername.user.name,
        passwordEncrypted: await encryptPassword(uniqueUsername.user.name),
        lessonAttempts: [],
      });
    }

    preprocessedData.classes[classIndex] = {
      id: uuid.v4(),
      name: `Klas ${classIndex + 1}`,
      level: educationLevels[classIndex],
      teachers: [teacher],
      students,
      courses: [
        {
          id: uuid.v4(),
          name: `Morfologie cursus ${classIndex + 1}`,
          lessons: _.uniqBy(wordfactoryExport, (e) => e.lesson.lesson_id)
            .sort((a, b) => a.lesson.lesson_id - b.lesson.lesson_id)
            .map(({ lesson }) => ({
              lessonId: uuid.v4(),
              lessonIndex: lesson.lesson_id,
              lessonPrefix: lesson.lessonPrefix,
              lessonInstruction: lesson.lessonInstruction,
              lessonTitle: lesson.lessonTitle,
              questionGroups: wordfactoryExport
                .find((e) => e.lesson.lessonPrefix === lesson.lessonPrefix)
                .lesson.formats.map((questionGroup, index) => ({
                  questionGroupId: uuid.v4(),
                  questionGroupFormat: questionGroup.format,
                  questionGroupIndex: index,
                  questionGroupTitle: questionGroup.data.formatTitle,
                  questions: convertFormatToQuestions({
                    lesson,
                    format: questionGroup,
                    items: questionGroup.data.item
                      ? [questionGroup.data.item]
                      : questionGroup.data.items || [],
                  }),
                })),
            })),
        },
      ],
    };
  }

  wordfactoryExport.forEach((lessonAttempt) => {
    const {
      user: { name },
      lesson,
    } = lessonAttempt;

    const theClass = preprocessedData.classes.find((c) =>
      c.students.some((student) => student.name === name)
    );
    const classIndex = preprocessedData.classes.indexOf(theClass);

    const preprocessedLesson = theClass.courses[0].lessons.find(
      (e) => e.lessonPrefix === lesson.lessonPrefix
    );
    const studentIndex = theClass.students.findIndex((e) => e.name === name);
    const lessonAttemptId = uuid.v4();
    const completed = lessonAttempt.lesson.formats.every((e) => e.completed);
    preprocessedData.classes[classIndex].students[
      studentIndex
    ].lessonAttempts.push({
      id: lessonAttemptId,
      lessonId: preprocessedLesson.lessonId,
      stoppedTime: lesson.stoppedTime,
      startedTime: lesson.startedTime,
      isStopped: lesson.isStopped,
      isStarted: lesson.isStarted,
      isCompleted: completed,
      questionGroups: preprocessedLesson.questionGroups
        .map((questionGroup, questionGroupIndex) => {
          const format = lessonAttempt.lesson.formats[questionGroupIndex];
          const questionGroupAttemptId = uuid.v4();
          if (format) {
            return {
              id: questionGroupAttemptId,
              questionGroupId: questionGroup.questionGroupId,
              isCompleted: format.data.isCompleted,
              showFeedback: format.data.showFeedback,
              timeElapsedSeconds: format.data.timeElapsedSeconds,
              answers: questionGroup.questions.map(
                (question, questionIndex) => {
                  const questionAttemptId = uuid.v4();
                  const answer = format.data.items
                    ? format.data.items[questionIndex]
                    : format.data.item;
                  return {
                    id: questionAttemptId,
                    questionId: question.questionId,
                    content:
                      convertQuestionItemToAnswer({
                        format,
                        question: answer,
                        questionIndex,
                      }) || {},
                    ...getScoreFromQuestion({
                      format,
                      question: answer,
                      questionIndex,
                    }),
                  };
                }
              ),
            };
          }
        })
        .filter((e) => e !== null && e !== undefined),
    });
  });

  fs.writeFileSync(
    'wordfactory-preprocessed.json',
    JSON.stringify(preprocessedData)
  );
})();
