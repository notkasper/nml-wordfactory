const db = require('../db');
const socketManager = require('../socketManager');

const initialize = async () => {
  db.QuestionAttempt.addHook(
    'afterCreate',
    async (questionAttempt, options) => {
      // TODO: This is super ugly and will be fixed once we add db shortcuts
      const teachers = await questionAttempt
        .getQuestion()
        .catch((err) => console.error(err))
        .then((e) => e.getQuestionGroup())
        .then((e) => e.getLesson())
        .then((e) => e.getCourse())
        .then((e) => e.getClass())
        .then((e) => e.getTeachers());
      teachers.forEach((teacher) => {
        if (socketManager.isConnected(teacher.id)) {
          socketManager.emitEvent(teacher.id, 'newQuestionAttempts');
        }
      });
    }
  );
};

module.exports = { initialize };
