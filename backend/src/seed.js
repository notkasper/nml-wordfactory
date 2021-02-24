const uuid = require('uuid');
const _ = require('lodash');
const { encryptPassword } = require('./_utils');

const wordfactoryExport = require('../wordfactory-export.json');

module.exports = async (db) => {
  const transaction = await db.sequelize.transaction();

  // TODO: remove
  await db.Teacher.destroy({ where: {} });
  await db.Student.destroy({ where: {} });
  await db.Lesson.destroy({ where: {} });
  await db.Question.destroy({ where: {} });
  await db.LessonAttempt.destroy({ where: {} });
  await db.Answer.destroy({ where: {} });

  try {
    // Create a general 'superuser' teacher
    const superuser = await db.Teacher.create(
      {
        id: uuid.v4(),
        name: 'superuser',
        password_encrypted: await encryptPassword('superuser'),
        email: 'super@user.nl',
      },
      { transaction }
    );

    // Retrieve all unique usernames from the export
    const usernames = _.uniqBy(wordfactoryExport, (e) => e.user.name).map(
      (e) => e.user.name
    );

    // Convert all usernames into students
    const students = [];
    for (const username of usernames) {
      students.push(
        await db.Student.create(
          {
            id: uuid.v4(),
            name: username,
            password_encrypted: username,
          },
          { transaction }
        )
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
      lessons.push(
        await db.Lesson.create(
          {
            id: uuid.v4(),
            lesson_prefix: lesson.lesson_prefix,
            lesson_title: lesson.lesson_title,
            lesson_instruction: lesson.lesson_instruction,
          },
          { transaction }
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

        await db.LessonAttempt.create(
          {
            id: uuid.v4(),
            lessonId: studentLesson.id,
            studentId: student.id,
            stopped_time: attempt.lesson.stoppedTime,
            started_time: attempt.lesson.startedTime,
            is_stopped: attempt.lesson.isStopped,
            is_started: attempt.lesson.isStarted,
            is_completed: attempt.lesson.isCompleted,
          },
          { transaction }
        );
      }
    }

    const formats = _.uniqBy(
      _.flatten(wordfactoryExport.map((e) => e.lesson.formats)),
      (e) => e.format
    );

    for (const format of formats) {
      await db.Question.create({
        id: uuid.v4(),
        lesson_id: '',
        data: {},
      });
    }

    await transaction.commit();
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    await transaction.rollback();
  }
};
