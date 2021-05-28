const db = require('../db');
const logger = require('../logger');
const socketManager = require('../socketManager');
const wordfactoryExperiment = require('../../wordfactory-experiment.json');

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

const main = async (req, res) => {
  const { stage } = req.params;
  logger.info(stage);
  switch (stage) {
    case 'init': {
      await db.LessonAttempt.destroy({ where: {} });
      await db.QuestionGroupAttempt.destroy({ where: {} });
      await db.QuestionAttempt.destroy({ where: {} });

      const bulkItems = generateBulkItems({ situation: situation1 });
      await db.LessonAttempt.bulkCreate(bulkItems.allLessonAttempts);
      await db.QuestionGroupAttempt.bulkCreate(
        bulkItems.allQuestionGroupAttempts
      );
      await db.QuestionAttempt.bulkCreate(bulkItems.allQuestionAttempts);
      break;
    }
    case 'one': {
      const bulkItems = generateBulkItems({ situation: situation2 });
      const { allQuestionGroupAttempts, allQuestionAttempts } = bulkItems;
      await db.QuestionGroupAttempt.bulkCreate(allQuestionGroupAttempts);
      await db.QuestionAttempt.bulkCreate(allQuestionAttempts);

      setTimeout(() => {
        socketManager.broadcast('notification', {
          message: 'De probleemcategoriën van leerlingen zijn veranderd.',
        });
      }, 5000);

      logger.info('Done entering new data.');
      break;
    }
    case 'two': {
      const bulkItems = generateBulkItems({ situation: situation3 });
      const { allQuestionGroupAttempts, allQuestionAttempts } = bulkItems;
      await db.QuestionGroupAttempt.bulkCreate(allQuestionGroupAttempts);
      await db.QuestionAttempt.bulkCreate(allQuestionAttempts);

      setTimeout(() => {
        socketManager.broadcast('notification', {
          message:
            'Leerlingen doen lang over opdrachten over "morfemen herkennen".',
        });
      }, 5000);

      logger.info('Done entering new data.');
      break;
    }
    case 'three': {
      const bulkItems = generateBulkItems({ situation: situation4 });
      const { allQuestionGroupAttempts, allQuestionAttempts } = bulkItems;
      await db.QuestionGroupAttempt.bulkCreate(allQuestionGroupAttempts);
      await db.QuestionAttempt.bulkCreate(allQuestionAttempts);

      setTimeout(() => {
        socketManager.broadcast('notification', {
          message:
            'Leerlingen in klas 1 vereisen aandacht, een opdracht is gemiddeld zeer slecht uitgevoerd.',
        });
      }, 5000);

      logger.info('Done entering new data.');
      break;
    }
  }
  res.status(200).send({ message: 'Can you feel it now, Mr Krabs?' });
};

module.exports = { main };
