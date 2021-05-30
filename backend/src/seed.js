const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const db = require('./db');
const logger = require('./logger');

const wordfactoryPreprocessed = require('../wordfactory-preprocessed.json');

(async () => {
  logger.info('Seeding initialized');
  await db.initialize();

  await db.Class.destroy({ where: {} });
  await db.Student.destroy({ where: {} });
  await db.Teacher.destroy({ where: {} });
  await db.Course.destroy({ where: {} });
  await db.TeacherClass.destroy({ where: {} });
  await db.StudentClass.destroy({ where: {} });
  await db.Lesson.destroy({ where: {} });
  await db.LessonAttempt.destroy({ where: {} });
  await db.Question.destroy({ where: {} });
  await db.QuestionAttempt.destroy({ where: {} });
  await db.QuestionGroup.destroy({ where: {} });
  await db.QuestionGroupAttempt.destroy({ where: {} });

  const allQuestionGroups = [];
  const allQuestions = [];
  const allLessonAttempts = [];
  const allQuestionGroupAttempts = [];
  const allQuestionAttempts = [];

  try {
    const { classes } = wordfactoryPreprocessed;

    for (const theClass of classes) {
      const createdClass = await db.Class.create({
        id: theClass.id,
        name: theClass.name,
        level: theClass.level,
      });

      for (const teacher of theClass.teachers) {
        const [upsertedTeacher] = await db.Teacher.upsert({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          passwordEncrypted: teacher.passwordEncrypted,
        });

        await createdClass.addTeacher(upsertedTeacher);
      }

      const students = await db.Student.bulkCreate(theClass.students);
      await createdClass.addStudents(students);

      for (const course of theClass.courses) {
        const createdCourse = await db.Course.create({
          id: course.id,
          classId: createdClass.id,
          name: course.name,
        });

        await createdClass.addCourse(createdCourse);

        for (const lesson of course.lessons) {
          const createdLesson = await db.Lesson.create({
            id: lesson.lessonId,
            courseId: course.id,
            index: lesson.lessonIndex,
            prefix: lesson.lessonPrefix,
            instruction: lesson.lessonInstruction,
            name: lesson.lessonTitle,
          });

          createdCourse.addLesson(createdLesson);

          for (const questionGroup of lesson.questionGroups) {
            const createdQuestionGroup = {
              id: questionGroup.questionGroupId,
              lessonId: createdLesson.id,
              index: questionGroup.questionGroupIndex,
              name: questionGroup.questionGroupTitle,
            };

            allQuestionGroups.push(createdQuestionGroup);

            for (const question of questionGroup.questions) {
              allQuestions.push({
                id: question.questionId,
                questionGroupId: createdQuestionGroup.id,
                data: question.data,
                index: question.questionIndex,
                type: question.type,
                contentTags: question.contentTags,
                instruction: question.instruction,
              });
            }
          }
        }
      }

      for (const studentData of theClass.students) {
        const lessonAttempts = studentData.lessonAttempts;
        for (const lessonAttempt of lessonAttempts) {
          const createdLessonAttempt = {
            id: lessonAttempt.id,
            studentId: studentData.id,
            lessonId: lessonAttempt.lessonId,
            stoppedTime: lessonAttempt.stoppedTime,
            startedTime: lessonAttempt.startedTime,
            isStopped: lessonAttempt.isStopped,
            isStarted: lessonAttempt.isStarted,
            isCompleted: lessonAttempt.isCompleted,
          };

          allLessonAttempts.push(createdLessonAttempt);

          for (const questionGroupAttempt of lessonAttempt.questionGroups) {
            const createdQuestionGroupAttempt = {
              id: questionGroupAttempt.id,
              classId: theClass.id,
              lessonId: lessonAttempt.lessonId,
              studentId: studentData.id,
              lessonAttemptId: createdLessonAttempt.id,
              questionGroupId: questionGroupAttempt.questionGroupId,
              timeElapsedSeconds: questionGroupAttempt.timeElapsedSeconds
                ? Math.round(questionGroupAttempt.timeElapsedSeconds)
                : 0,
              correct: questionGroupAttempt.correct,
              incorrect: questionGroupAttempt.incorrect,
              missed: questionGroupAttempt.missed,
              score: questionGroupAttempt.score,
              isCompleted: questionGroupAttempt.isCompleted || false,
              showFeedback: questionGroupAttempt.showFeedback || false,
            };

            allQuestionGroupAttempts.push(createdQuestionGroupAttempt);

            for (const questionAttempt of questionGroupAttempt.answers) {
              allQuestionAttempts.push({
                id: questionAttempt.id,
                classId: theClass.id,
                lessonId: lessonAttempt.lessonId,
                studentId: studentData.id,
                questionGroupAttemptId: createdQuestionGroupAttempt.id,
                questionId: questionAttempt.questionId,
                correct: questionAttempt.correct,
                incorrect: questionAttempt.incorrect,
                missed: questionAttempt.missed,
                score: questionAttempt.score,
                content: questionAttempt.content,
              });
            }
          }
        }
      }
    }

    await db.QuestionGroup.bulkCreate(allQuestionGroups);
    await db.Question.bulkCreate(allQuestions);
    await db.LessonAttempt.bulkCreate(allLessonAttempts);
    await db.QuestionGroupAttempt.bulkCreate(allQuestionGroupAttempts);
    await db.QuestionAttempt.bulkCreate(allQuestionAttempts);
  } catch (error) {
    logger.error(error);
  } finally {
    db.close();
  }
})();
