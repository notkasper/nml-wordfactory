const uuid = require('uuid');
const _ = require('lodash');
const { encryptPassword } = require('./_utils');

const wordfactoryExport = require('../wordfactory-export.json');

const filterAnswerFromFormat = (format) => {
  return format.data;
};

module.exports = async (db) => {
  // TODO: remove
  await db.User.destroy({ where: {} });
  await db.Lesson.destroy({ where: {} });
  await db.Question.destroy({ where: {} });
  await db.LessonAttempt.destroy({ where: {} });
  await db.Answer.destroy({ where: {} });

  // TESTING
  try {
    // Create a general 'superuser' teacher
    const superuser = await db.Teacher.create({
      id: uuid.v4(),
      name: 'superuser',
      password_encrypted: await encryptPassword('superuser'),
      email: 'super@user.nl',
    });

    // Retrieve all unique usernames from the export
    const usernames = _.uniqBy(wordfactoryExport, (e) => e.user.name).map(
      (e) => e.user.name
    );

    // Convert all usernames into students
    const students = [];
    for (const username of usernames) {
      students.push(
        await db.Student.create({
          id: uuid.v4(),
          name: username,
          password_encrypted: username,
        })
      );
    }

    // Add all students to the superuser teacher
    await superuser.addStudents(students);

    // Retrieve all unique lessons
    const uniqueLessons = _.uniqBy(
      wordfactoryExport,
      (e) => e.lesson.lesson_id
    ).map((e) => ({
      lesson_prefix: e.lesson.lessonPrefix,
      lesson_title: e.lesson.lessonTitle,
      lesson_instruction: e.lesson.lessonInstruction,
    }));

    // convert all unique lessons into lessons
    const lessons = [];
    for (const lesson of uniqueLessons) {
      const lesson_id = uuid.v4();
      const questions = wordfactoryExport
        .find((e) => e.lesson.lessonPrefix === lesson.lesson_prefix)
        .lesson.formats.map((e) => ({
          id: uuid.v4(),
          lesson_id,
          data: filterAnswerFromFormat(e),
          format: e.format,
        }));

      lessons.push(
        await db.Lesson.create(
          {
            id: lesson_id,
            lesson_prefix: lesson.lesson_prefix,
            lesson_title: lesson.lesson_title,
            lesson_instruction: lesson.lesson_instruction,
            questions,
          },
          { include: db.Question }
        )
      );
    }

    // Add all lessons to the superuser teacher and students
    await superuser.addLessons(lessons);
    const dummy = await superuser.getStudents();

    for (const student of dummy) {
      await student.addLessons(lessons);
      const attempts = wordfactoryExport.filter(
        (e) => e.user.name === student.name
      );

      for (const attempt of attempts) {
        const studentLesson = await db.Lesson.findOne({
          where: {
            lesson_prefix: attempt.lesson.lessonPrefix,
          },
        });

        await db.LessonAttempt.create({
          id: uuid.v4(),
          lessonId: studentLesson.id,
          studentId: student.id,
          stopped_time: attempt.lesson.stoppedTime,
          started_time: attempt.lesson.startedTime,
          is_stopped: attempt.lesson.isStopped,
          is_started: attempt.lesson.isStarted,
          is_completed: attempt.lesson.isCompleted,
        });
      }
    }
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
  }
};
