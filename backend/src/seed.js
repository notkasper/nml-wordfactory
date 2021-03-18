const uuid = require('uuid');
const _ = require('lodash');
const dotenv = require('dotenv');
const path = require('path');

const db = require('./db');
const wordfactoryPreprocessed = require('../wordfactory-preprocessed.json');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seed = async () => {
  console.log('[SEEDING]: Seeding initialized');
  await db.initialize();

  await db.User.destroy({ where: {} });
  await db.Lesson.destroy({ where: {} });
  await db.LessonAttempt.destroy({ where: {} });
  await db.LessonGroup.destroy({ where: {} });
  await db.Question.destroy({ where: {} });
  await db.QuestionAttempt.destroy({ where: {} });
  await db.QuestionGroup.destroy({ where: {} });
  await db.QuestionGroupAttempt.destroy({ where: {} });
  await db.TeacherStudent.destroy({ where: {} });
  await db.LessonGroup.destroy({ where: {} });

  try {
    const { users, lessons } = wordfactoryPreprocessed;
    const [teacher, ...students] = await db.User.bulkCreate(users); // First user is a teacher in the seeding data file
    await teacher.addStudents(students);

    const lessonGroup = await db.LessonGroup.create({
      id: uuid.v4(),
      title: 'Superuser course',
      userId: teacher.id,
    });

    for (const lesson of lessons) {
      const createdLesson = await db.Lesson.create({
        id: lesson.lessonId,
        groupId: lessonGroup.id,
        prefix: lesson.lessonPrefix,
        instruction: lesson.lessonInstruction,
        title: lesson.lessonTitle,
      });

      lessonGroup.addLessons([createdLesson]);
      teacher.addLessons([createdLesson]);
      for (const student of students) {
        await student.addLessons([createdLesson]);
      }

      for (const questionGroup of lesson.questionGroups) {
        const createdQuestionGroup = await db.QuestionGroup.create({
          id: questionGroup.questionGroupId,
          lessonId: createdLesson.id,
          index: questionGroup.questionGroupIndex,
          title: questionGroup.questionGroupTitle,
        });

        for (const question of questionGroup.questions) {
          await db.Question.create({
            id: question.questionId,
            groupId: createdQuestionGroup.id,
            data: question.data,
            index: question.questionIndex,
            type: question.type,
            instruction: question.instruction,
          });
        }
      }
    }

    for (const user of users.filter((e) => e.role === 'student')) {
      const lessonAttempts = user.lessonAttempts;
      for (const lessonAttempt of lessonAttempts) {
        const createdLessonAttempt = await db.LessonAttempt.create({
          id: lessonAttempt.id,
          userId: user.id,
          lessonId: lessonAttempt.lessonId,
          stoppedTime: lessonAttempt.stoppedTime,
          startedTime: lessonAttempt.startedTime,
          isStopped: lessonAttempt.isStopped,
          isStarted: lessonAttempt.isStarted,
          isCompleted: lessonAttempt.isCompleted,
        });

        for (const questionGroupAttempt of lessonAttempt.questionGroups) {
          const createdQuestionGroupAttempt = await db.QuestionGroupAttempt.create(
            {
              id: questionGroupAttempt.id,
              lessonAttemptId: createdLessonAttempt.id,
              questionGroupId: questionGroupAttempt.questionGroupId,
              timeElapsedSeconds: questionGroupAttempt.timeElapsedSeconds
                ? Math.round(questionGroupAttempt.timeElapsedSeconds)
                : 0,
              correct: questionGroupAttempt.correct,
              incorrect: questionGroupAttempt.incorrect,
              missed: questionGroupAttempt.missed,
              isCompleted: questionGroupAttempt.isCompleted || false,
              showFeedback: questionGroupAttempt.showFeedback || false,
            }
          );

          for (const questionAttempt of questionGroupAttempt.answers) {
            await db.QuestionAttempt.create({
              id: questionAttempt.id,
              groupAttemptId: createdQuestionGroupAttempt.id,
              questionId: questionAttempt.questionId,
              content: questionAttempt.content,
            });
          }
        }
      }
    }

    console.log('[SEEDING]: Seeding completed');
  } catch (error) {
    console.error(error);
  } finally {
    db.close();
  }
};

seed();
