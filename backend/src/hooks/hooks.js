const db = require('../db');
const socketManager = require('../socketManager');
const logger = require('../logger');

const getTeachersFromQuestionAttempt = async (questionAttempt) => {
  const teachers = await questionAttempt
    .getQuestion()
    .catch((err) => console.error(err))
    .then((e) => e.getQuestionGroup())
    .then((e) => e.getLesson())
    .then((e) => e.getCourse())
    .then((e) => e.getClass())
    .then((e) => e.getTeachers());
  return teachers;
};

const initialize = async () => {
  db.QuestionAttempt.addHook(
    'afterCreate',
    async (questionAttempt, options) => {
      // TODO: This is super ugly and will be fixed once we add db shortcuts
      const teachers = await getTeachersFromQuestionAttempt(questionAttempt);
      teachers.forEach((teacher) => {
        if (socketManager.isConnected(teacher.id)) {
          socketManager.emitEvent(teacher.id, 'newQuestionAttempts');
        }
      });
    }
  );

  db.QuestionAttempt.addHook(
    'afterBulkCreate',
    async (questionAttempts, options) => {
      logger.info('After bulk create hook');
      const teachers = [];
      for (const questionAttempt of questionAttempts) {
        teachers.push(
          ...(await getTeachersFromQuestionAttempt(questionAttempt))
        );
      }
      // Can result in duplicate teacher instances
      const teacherIds = [];
      teachers.forEach((teacher) => {
        if (!teacherIds.includes(teacher.id)) {
          teacherIds.push(teacher.id);
        }
      });
      logger.info('Emitting to', teacherIds);
      teacherIds.forEach((teacherId) => {
        if (socketManager.isConnected(teacherId)) {
          socketManager.emitEvent(teacherId, 'newQuestionAttempts');
          socketManager.emitEvent(teacherId, 'newQuestionAttempts_temp'); // remove this one at some point
        }
      });
    }
  );
};

module.exports = { initialize };
