const uuid = require('uuid');
const _ = require('lodash');
const dotenv = require('dotenv');
const db = require('./db');
const path = require('path');
const { encryptPassword } = require('./_utils');

const wordfactoryExport = require('../wordfactory-export.json');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const filterAnswerFromFormat = (format) => {
  return format.data;
};

const seed = async () => {
  console.log('Seeding started...');
  await db.initialize();
  await db.User.destroy({ where: {} });
  await db.Lesson.destroy({ where: {} });
  await db.Question.destroy({ where: {} });
  await db.LessonAttempt.destroy({ where: {} });
  await db.Answer.destroy({ where: {} });
  await db.TeacherStudent.destroy({ where: {} });
  await db.UserLesson.destroy({ where: {} });

  try {
    // Create a general 'superuser' teacher
    const superuser = await db.User.create({
      id: uuid.v4(),
      role: 'teacher',
      name: 'superuser',
      passwordEncrypted: await encryptPassword('superuser'),
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
        await db.User.create({
          id: uuid.v4(),
          role: 'student',
          name: username,
          passwordEncrypted: await encryptPassword(username),
        })
      );
    }

    // Add all students to the superuser teacher
    await superuser.addStudents(students);

    // Retrieve all unique lessons
    const uniqueLessons = _.uniqBy(
      wordfactoryExport,
      (e) => e.lesson.lesson_id
    ).map((e) => e.lesson);

    // convert all unique lessons into lessons
    const lessons = [];
    for (const lesson of uniqueLessons) {
      const lessonId = uuid.v4();
      const questions = wordfactoryExport
        .find((e) => e.lesson.lessonPrefix === lesson.lessonPrefix)
        .lesson.formats.map((e) => ({
          id: uuid.v4(),
          lessonId,
          data: filterAnswerFromFormat(e),
          format: e.format,
        }));

      lessons.push(
        await db.Lesson.create(
          {
            id: lessonId,
            lessonPrefix: lesson.lessonPrefix,
            lessonTitle: lesson.lessonTitle,
            lessonInstruction: lesson.lessonInstruction,
            Questions: questions,
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
            lessonPrefix: attempt.lesson.lessonPrefix,
          },
        });

        await db.LessonAttempt.create({
          id: uuid.v4(),
          lessonId: studentLesson.id,
          userId: student.id,
          stoppedTime: attempt.lesson.stoppedTime,
          startedTime: attempt.lesson.startedTime,
          isStopped: attempt.lesson.isStopped,
          isStarted: attempt.lesson.isStarted,
          isCompleted: attempt.lesson.isCompleted,
        });
      }
    }
    console.log('Seeding completed');
  } catch (error) {
    console.error(error);
  } finally {
    db.close();
  }
};

(async () => await seed())();
