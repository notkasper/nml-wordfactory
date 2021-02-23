const uuid = require('uuid');
const _ = require('lodash');

const wordfactoryExport = require('../wordfactory-export.json');

module.exports = async (db) => {
  const transaction = await db.sequelize.transaction();

  try {
    // Create a general 'superuser' teacher
    const superuser = await db.Teacher.create(
      {
        id: uuid.v4(),
        name: 'superuser',
        password_encrypted: 'superuser',
        email: 'superuser@test.nl',
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

    // Add all lessons to the superuser teacher
    await superuser.addLessons(lessons);

    await transaction.commit();
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    await transaction.rollback();
  }
};
