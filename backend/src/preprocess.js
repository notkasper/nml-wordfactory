const fs = require('fs');
const uuid = require('uuid');
const _ = require('lodash');
const { encryptPassword } = require('./_utils');

const wordfactoryExport = require('../wordfactory-export.json');

convertQuestionItemToAnswer = ({ lesson, format, question }) => {
  if (['Format_F1', 'Format_F1b'].includes(format.format)) {
    return Object.values(question.answers || []);
  }

  if (['Format_V1', 'Format_V1c'].includes(format.format)) {
    return [question.answers.indexOf(question.answer)];
  }

  if (['Format_W1'].includes(format.format)) {
    const reference = (format.data.items[0] || []).morphemes || [];
    const answers = format.data.answers || [];
    return answers.map((answer) => reference.indexOf(answer));
  }

  if (['Format_Z1', 'Format_Z1b'].includes(format.format)) {
    return question.words.map((word) => question.selectedWords.includes(word));
  }

  if (format.format.includes('Format_UQ')) {
    return question.answer || '';
  }

  if (['Format_K1'].includes(format.format)) {
    return [3];
  }

  if (
    [
      'Format_H1',
      'Format_B1',
      'Format_B2',
      'Format_B3',
      'Format_W2',
      'Format_WC',
    ].includes(format.format)
  ) {
    return null;
  }

  return null;
};

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
      instruction: item.question || '',
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
      instruction: item.question || '',
      data: {
        wordpart: item.wordpart,
        options: item.morphemes.map((answer) => ({
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
      data: {},
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
      passwordEncrypted: await encryptPassword('superuser'),
    },
  ];

  for (const uniqueUsername of uniqueUsernames) {
    preprocessedData.users.push({
      id: uuid.v4(),
      role: 'student',
      name: uniqueUsername.user.name,
      passwordEncrypted: await encryptPassword(uniqueUsername.user.name),
      lessonAttempts: [],
    });
  }

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
          questionGroupFormat: questionGroup.format,
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

  wordfactoryExport.forEach((lessonAttempt) => {
    const {
      user: { name },
      lesson,
    } = lessonAttempt;

    const preprocessedLesson = preprocessedData.lessons.find(
      (e) => e.lessonPrefix === lesson.lessonPrefix
    );

    const index = preprocessedData.users.findIndex((e) => e.name === name);
    const lessonAttemptId = uuid.v4();
    preprocessedData.users[index].lessonAttempts.push({
      id: lessonAttemptId,
      lessonId: preprocessedLesson.lessonId,
      stoppedTime: lesson.stoppedTime,
      startedTime: lesson.startedTime,
      isStopped: lesson.isStopped,
      isStarted: lesson.isStarted,
      isCompleted: lesson.isCompleted,
      questionGroups: preprocessedLesson.questionGroups
        .map((questionGroup, questionGroupIndex) => {
          const format = lessonAttempt.lesson.formats[questionGroupIndex];
          const questionGroupAttemptId = uuid.v4();
          if (format) {
            return {
              id: questionGroupAttemptId,
              questionGroupId: questionGroup.questionGroupId,
              isCompleted: format.data.isCompleted,
              showFeedback: format.data.showFeedback,
              correct: format.data.correct,
              incorrect: format.data.incorrect,
              missed: format.data.missed,
              timeElapsedSeconds: format.data.timeElapsedSeconds,
              answers: questionGroup.questions.map(
                (question, questionIndex) => {
                  const questionAttemptId = uuid.v4();
                  const answer = format.data.items
                    ? format.data.items[questionIndex]
                    : format.data.item;
                  return {
                    id: questionAttemptId,
                    questionId: question.questionId,
                    content:
                      convertQuestionItemToAnswer({
                        lesson,
                        format,
                        question: answer,
                      }) || {},
                  };
                }
              ),
            };
          }
        })
        .filter((e) => e !== null && e !== undefined),
    });
  });

  fs.writeFileSync(
    'wordfactory-preprocessed.json',
    JSON.stringify(preprocessedData)
  );
};

preprocess();
