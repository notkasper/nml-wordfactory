const fs = require('fs');
const uuid = require('uuid');
const _ = require('lodash');

const wordfactoryExport = require('../wordfactory-export.json');

const convertFormatToQuestions = ({ lesson, format, items }) => {
  if (['Format_F1b'].includes(format)) {
    return [
      {
        questionId: uuid.v4(),
        questionIndex: 0,
        type: 'fillInTheBlanks',
        instruction: lesson.lessonInstruction,
        data: {
          story: items[0].story.replace(/WOORD_OPTIE/g, '<BLANK>'),
        },
      },
    ];
  }

  if (['Format_V1', 'Format_V1c'].includes(format)) {
    return items.map((item, index) => ({
      questionId: uuid.v4(),
      questionIndex: index,
      type: 'multipleChoice',
      instruction: item.question,
      data: {
        options: item.answers.map((answer, index) => ({
          value: answer,
          isCorrect: index === item.correctAnswer,
        })),
      },
    }));
  }

  if (['Format_W1'].includes(format)) {
    return items.map((item, index) => ({
      questionId: uuid.v4(),
      questionIndex: index,
      type: 'multipleChoice',
      instruction: item.question,
      data: {
        wordpart: item.wordpart,
        options: item.morphemes.map((answer, index) => ({
          value: answer,
          isCorrect: item.answers.includes(answer),
        })),
      },
    }));
  }

  if (['Format_Z1', 'Format_Z1b'].includes(format)) {
    return [
      {
        questionId: uuid.v4(),
        questionIndex: 0,
        type: 'clickTheRightWords',
        instruction: lesson.lessonInstruction,
        data: {
          options: items[0].story.split(/\W+/).map((word) => ({
            value: word,
            isOption: items[0].words.includes(word),
            isCorrect: items[0].correctWords.includes(word),
          })),
        },
      },
    ];
  }

  if (format.includes('Format_UQ')) {
    return items.map((item, index) => ({
      questionId: uuid.v4(),
      questionIndex: index,
      type: 'open',
      instruction: item.question,
      data: {},
    }));
  }

  if (['Format_K1'].includes(format)) {
    return items.map((item, index) => ({
      questionId: uuid.v4(),
      questionIndex: index,
      type: 'divideTheWord',
      instruction: lesson.lessonInstruction,
      data: {
        word: item.word,
        correctAnswer: item.morphemes
          .map((morpheme, index) => {
            if (index !== item.morphemes.length - 1) {
              return item.word.indexOf(morpheme) + morpheme.length;
            }
          })
          .filter((e) => e !== null && e !== undefined),
      },
    }));
  }

  if (['Format_F1'].includes(format)) {
    return [
      {
        questionId: uuid.v4(),
        questionIndex: 0,
        type: 'combineAndFillInTheBlanks',
        instruction: lesson.lessonInstruction,
        data: {
          story: items[0].story.replace(/WOORD_OPTIE/g, '<BLANK>'),
          words: items[0].words,
          morphemes: items[0].morphemes,
        },
      },
    ];
  }

  // question types which we do not know yet what to do with
  if (
    [
      'Format_H1',
      'Format_B1',
      'Format_B2',
      'Format_B3',
      'Format_W2',
      'Format_WC',
    ].includes(format)
  ) {
    return items.map((item, index) => ({
      questionId: uuid.v4(),
      questionIndex: index,
      type: 'UNKNOWN',
      instruction: lesson.lessonInstruction,
      data: null,
    }));
  }

  return {};
};

const preprocessedData = {};
const preprocess = async () => {
  const uniqueUsernames = _.uniqBy(wordfactoryExport, (e) => e.user.name);
  preprocessedData.users = [
    {
      id: uuid.v4(),
      role: 'teacher',
      name: 'superuser',
      email: 'super@user.nl',
    },
    ...uniqueUsernames.map((e) => ({
      id: uuid.v4(),
      role: 'student',
      name: e.user.name,
    })),
  ];

  const uniqueLessons = _.uniqBy(wordfactoryExport, (e) => e.lesson.lesson_id)
    .sort((a, b) => a.lesson.lesson_id - b.lesson.lesson_id)
    .map(({ lesson }) => ({
      lessonId: uuid.v4(),
      lessonIndex: lesson.lesson_id,
      lessonPrefix: lesson.lessonPrefix,
      lessonInstruction: lesson.lessonInstruction,
      lessonTitle: lesson.lessonTitle,
      questionGroups: wordfactoryExport
        .find((e) => e.lesson.lessonPrefix === lesson.lessonPrefix)
        .lesson.formats.map((questionGroup, index) => ({
          questionGroupId: uuid.v4(),
          questionGroupIndex: index,
          questionGroupTitle: questionGroup.data.formatTitle,
          questions: convertFormatToQuestions({
            lesson,
            format: questionGroup.format,
            items: questionGroup.data.item
              ? [questionGroup.data.item]
              : questionGroup.data.items || [],
          }),
        })),
    }));

  preprocessedData.lessons = uniqueLessons;

  fs.writeFileSync(
    'wordfactory-preprocessed.json',
    JSON.stringify(preprocessedData)
  );
};

preprocess();
