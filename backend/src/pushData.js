const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const db = require('./db');
const logger = require('./logger');

const { stdin } = process;
stdin.setRawMode(true);
stdin.setEncoding('utf8');

const wordfactoryExperiment = require('../wordfactory-experiment.json');
const [class1] = wordfactoryExperiment.classes;
const [lesson] = class1.courses[0].lessons;

const numberOfQGPs = class1.courses[0].lessons[0].questionGroups.length;

// initial situation with 2 question groups done
const situation1 = class1.courses[0].lessons[0].questionGroups
  .slice(0, 2)
  .map((e) => e.questionGroupId);

// slight change of grades with question group 3
const situation2 = class1.courses[0].lessons[0].questionGroups
  .slice(2, 3)
  .map((e) => e.questionGroupId);

// situation where students are taking a long time
const situation3 = class1.courses[0].lessons[0].questionGroups
  .slice(3, 22)
  .map((e) => e.questionGroupId);

// situation where correctness is very bad
const situation4 = class1.courses[0].lessons[0].questionGroups
  .slice(22, numberOfQGPs)
  .map((e) => e.questionGroupId);

const generateBulkItems = ({ situation }) => {
  const allLessonAttempts = [];
  const allQuestionGroupAttempts = [];
  const allQuestionAttempts = [];

  for (const student of class1.students) {
    const { lessonAttempts } = student;
    for (const lessonAttempt of lessonAttempts) {
      allLessonAttempts.push({ ...lessonAttempt, studentId: student.id });
      for (const questionGroup of lessonAttempt.questionGroups) {
        if (situation.includes(questionGroup.questionGroupId)) {
          allQuestionGroupAttempts.push({
            ...questionGroup,
            lessonAttemptId: lessonAttempt.id,
            classId: class1.id,
            lessonId: lesson.lessonId,
            studentId: student.id,
            timeElapsedSeconds: questionGroup.timeElapsedSeconds || 0,
            isCompleted: true,
            showFeedback: true,
          });

          for (const question of questionGroup.answers) {
            allQuestionAttempts.push({
              ...question,
              questionGroupAttemptId: questionGroup.id,
              classId: class1.id,
              lessonId: lesson.lessonId,
              studentId: student.id,
            });
          }
        }
      }
    }
  }

  return { allLessonAttempts, allQuestionGroupAttempts, allQuestionAttempts };
};

(async () => {
  await db.initialize();

  await db.LessonAttempt.destroy({ where: {} });
  await db.QuestionGroupAttempt.destroy({ where: {} });
  await db.QuestionAttempt.destroy({ where: {} });

  const bulkItems = generateBulkItems({ situation: situation1 });
  await db.LessonAttempt.bulkCreate(bulkItems.allLessonAttempts);
  await db.QuestionGroupAttempt.bulkCreate(bulkItems.allQuestionGroupAttempts);
  await db.QuestionAttempt.bulkCreate(bulkItems.allQuestionAttempts);

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
      logger.info('Entering new data ...');

      counter += 1;
      if (counter === 1) {
        const bulkItems = generateBulkItems({ situation: situation2 });
        const { allQuestionGroupAttempts, allQuestionAttempts } = bulkItems;
        await db.QuestionGroupAttempt.bulkCreate(allQuestionGroupAttempts);
        await db.QuestionAttempt.bulkCreate(allQuestionAttempts);

        logger.info('Done entering new data.');
      }

      if (counter === 2) {
        const bulkItems = generateBulkItems({ situation: situation3 });
        const { allQuestionGroupAttempts, allQuestionAttempts } = bulkItems;
        await db.QuestionGroupAttempt.bulkCreate(allQuestionGroupAttempts);
        await db.QuestionAttempt.bulkCreate(allQuestionAttempts);

        logger.info('Done entering new data.');
      }

      if (counter === 3) {
        const bulkItems = generateBulkItems({ situation: situation4 });
        const { allQuestionGroupAttempts, allQuestionAttempts } = bulkItems;
        await db.QuestionGroupAttempt.bulkCreate(allQuestionGroupAttempts);
        await db.QuestionAttempt.bulkCreate(allQuestionAttempts);

        logger.info('Done entering new data.');
        process.exit();
      }
    }
  });
})();
