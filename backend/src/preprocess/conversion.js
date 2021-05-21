const uuid = require('uuid');

const convertQuestionItemToAnswer = ({
  format,
  question,
  questionIndex = 0,
}) => {
  if (['Format_F1', 'Format_F1b'].includes(format.format)) {
    return Object.values(question.answers || []);
  }

  if (['Format_V1', 'Format_V1c'].includes(format.format)) {
    return [question.answers.indexOf(question.answer)].filter((e) => e !== -1);
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

  if (['Format_H1'].includes(format.format)) {
    return format.data.items
      .map((item, index) => {
        if (item.selected) {
          return index;
        }
      })
      .filter((e) => e !== null && e !== undefined);
  }

  if (['Format_B1', 'Format_B2', 'Format_B3'].includes(format.format)) {
    return question.assignment.words.map((e) =>
      e.morphemes.map((m) => m.selectedAnswer || null)
    )[questionIndex];
  }

  if (['Format_W2'].includes(format.format)) {
    return question.selectedAnswer;
  }

  if (['Format_WC'].includes(format.format)) {
    return question;
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
          story: items[0].story,
          words: items[0].words,
          correctWords: items[0].correctWords,
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

  if (['Format_H1'].includes(format)) {
    return [
      {
        questionId: uuid.v4(),
        questionIndex: 0,
        type: 'multipleChoice',
        instruction: lesson.lessonInstruction,
        data: {
          options: items.map((item) => ({
            value: item.word,
            isCorrect: item.isCorrect,
          })),
        },
      },
    ];
  }

  if (['Format_B1', 'Format_B2'].includes(format)) {
    return items[0].assignment.words.map((w, index) => ({
      questionId: uuid.v4(),
      questionIndex: index,
      type: 'multipleChoiceGroup',
      instruction: lesson.lessonInstruction,
      data: {
        word: w.word,
        morphemes: w.morphemes.map((m) => ({
          value: m.morpheme,
          options: m.options.map((option) => ({
            value: option,
            isCorrect: option === m.answer,
          })),
        })),
      },
    }));
  }

  if (['Format_B3'].includes(format)) {
    return items[0].assignment.words.map((w, index) => ({
      questionId: uuid.v4(),
      questionIndex: index,
      type: 'openGroup',
      instruction: lesson.lessonInstruction,
      data: {
        word: w.word,
        morphemes: w.morphemes.map((m) => ({
          value: m.morpheme,
        })),
      },
    }));
  }

  if (['Format_W2'].includes(format)) {
    return [
      {
        questionId: uuid.v4(),
        questionIndex: 0,
        type: 'open',
        instruction: lesson.lessonInstruction,
        data: {
          wordpart: items[0].wordpart,
        },
      },
    ];
  }

  if (['Format_WC'].includes(format)) {
    return [
      {
        questionId: uuid.v4(),
        questionIndex: 0,
        type: 'list',
        instruction: lesson.lessonInstruction,
        data: {},
      },
    ];
  }

  return {};
};

module.exports = {
  convertQuestionItemToAnswer,
  convertFormatToQuestions,
};
