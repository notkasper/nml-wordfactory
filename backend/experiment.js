const fs = require('fs');
const faker = require('faker');

const wordfactoryPreprocessed = require('./wordfactory-preprocessed.json');

// Step 1: only preprocess data for 'Klas 1'
wordfactoryPreprocessed.classes = wordfactoryPreprocessed.classes.filter(
  (aClass) => aClass.name === 'Klas 1'
);

// Step 2: only take attempts for 'Les 1'
const [class1] = wordfactoryPreprocessed.classes;
class1.courses[0].lessons = class1.courses[0].lessons.filter(
  (lesson) => lesson.lessonPrefix === 'Les 1'
);

const { lessonId } = class1.courses[0].lessons[0];

class1.students.map((student) => {
  student.lessonAttempts = student.lessonAttempts.filter(
    (lessonAttempt) => lessonAttempt.lessonId === lessonId
  );
  return student;
});

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

for (const student of class1.students) {
  const questionGroups = student?.lessonAttempts?.[0]?.questionGroups || [];
  for (const questionGroup of questionGroups) {
    if (situation1.includes(questionGroup.questionGroupId)) {
      // do nothing: it is the baseline
      const index = class1.students.indexOf(student);
      const total =
        questionGroup.correct +
          questionGroup.incorrect +
          questionGroup.missed || 0;

      const ratio =
        (total - (index / class1.students.length) * total || 0) / total || 0;
      const correct = Math.floor(ratio * total);
      const incorrect = total - correct;

      questionGroup.correct = correct;
      questionGroup.incorrect = incorrect;
      questionGroup.missed = 0;
    }

    // mimic score slightly with some changes
    if (situation2.includes(questionGroup.questionGroupId)) {
      const index = class1.students.indexOf(student);
      const total =
        questionGroup.correct +
          questionGroup.incorrect +
          questionGroup.missed || 0;

      const ratio =
        (total - (index / class1.students.length) * total || 0) / total || 0;
      const correct = Math.floor(ratio * total);
      const incorrect = total - correct;

      questionGroup.correct = correct;
      questionGroup.incorrect = incorrect;
      questionGroup.missed = 0;
    }

    // students are doing longer to finish the exercise
    if (situation3.includes(questionGroup.questionGroupId)) {
      questionGroup.timeElapsedSeconds = faker.datatype.number({
        min: 450,
        max: 800,
      });
    }

    // very bad performance of class
    if (situation4.includes(questionGroup.questionGroupId)) {
      const total =
        questionGroup.correct +
          questionGroup.incorrect +
          questionGroup.missed || 0;

      // very bad made question
      if (situation4[0] === questionGroup.questionGroupId) {
        questionGroup.correct = faker.datatype.number({ min: 0, max: 1 });
      } else {
        questionGroup.correct = faker.datatype.number({ min: 1, max: 3 });
      }

      questionGroup.incorrect =
        total - questionGroup.correct >= 0 ? total - questionGroup.correct : 0;
      questionGroup.missed = 0;
    }
  }
}

fs.writeFileSync(
  'wordfactory-experiment.json',
  JSON.stringify(wordfactoryPreprocessed)
);
