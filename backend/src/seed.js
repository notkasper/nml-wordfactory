const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const db = require('./db');
const wordfactoryPreprocessed = require('../wordfactory-preprocessed.json');
const logger = require('./logger');

const seed = async () => {
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

  try {
    const { users, lessons } = wordfactoryPreprocessed;
    const [teacherData, ...studentsData] = users;
    const teacher = await db.Teacher.create(teacherData);
    const students = await db.Student.bulkCreate(studentsData);

    const theClass = await db.Class.create({
      id: 'b5fb3711-1157-4f9b-b387-d9e549561012',
      name: 'Oefen klas 1',
    });

    await theClass.addTeacher(teacher);
    await theClass.addStudents(students);

    const course = await db.Course.create({
      id: '94e8e1fc-dd2d-448d-a829-f7cc4369fd24',
      classId: theClass.id,
      name: 'Morphologie cursus 1',
    });

    await theClass.addCourse(course);

    for (const lesson of lessons) {
      const createdLesson = await db.Lesson.create({
        id: lesson.lessonId,
        courseId: course.id,
        index: lesson.lessonIndex,
        prefix: lesson.lessonPrefix,
        instruction: lesson.lessonInstruction,
        name: lesson.lessonTitle,
      });

      course.addLesson(createdLesson);

      for (const questionGroup of lesson.questionGroups) {
        const createdQuestionGroup = await db.QuestionGroup.create({
          id: questionGroup.questionGroupId,
          lessonId: createdLesson.id,
          index: questionGroup.questionGroupIndex,
          name: questionGroup.questionGroupTitle,
        });

        for (const question of questionGroup.questions) {
          await db.Question.create({
            id: question.questionId,
            questionGroupId: createdQuestionGroup.id,
            data: question.data,
            index: question.questionIndex,
            type: question.type,
            instruction: question.instruction,
          });
        }
      }
    }

    for (const studentData of studentsData) {
      const lessonAttempts = studentData.lessonAttempts;
      for (const lessonAttempt of lessonAttempts) {
        const createdLessonAttempt = await db.LessonAttempt.create({
          id: lessonAttempt.id,
          studentId: studentData.id,
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
              questionGroupAttemptId: createdQuestionGroupAttempt.id,
              questionId: questionAttempt.questionId,
              content: questionAttempt.content,
            });
          }
        }
      }
    }

    logger.info('Seeding completed');
  } catch (error) {
    logger.error(error);
  } finally {
    db.close();
  }
};

seed();
