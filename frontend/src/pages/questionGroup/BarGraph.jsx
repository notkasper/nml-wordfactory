import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Bar } from 'react-chartjs-2';
import Title from '../_shared/Title';

const calculateDistribution = (
  questionGroupAttempts,
  amountQuestions,
  questionIds
) => {
  const correctPerQuestion = Array(amountQuestions).fill(0);
  const incorrectPerQuestion = Array(amountQuestions).fill(0);
  const missedPerQuestion = Array(amountQuestions).fill(0);

  questionGroupAttempts.forEach((questionGroupAttempt) => {
    if (questionGroupAttempt.isCompleted) {
      questionGroupAttempt.questionAttempts.forEach((questionAttempt) => {
        const indexCorrect = questionIds.findIndex(
          (el) => el === questionAttempt.questionId && questionAttempt.correct
        );
        correctPerQuestion[indexCorrect] += 1;
        const indexIncorrect = questionIds.findIndex(
          (el) => el === questionAttempt.questionId && questionAttempt.incorrect
        );
        incorrectPerQuestion[indexIncorrect] += 1;
        const indexMissed = questionIds.findIndex(
          (el) => el === questionAttempt.questionId && questionAttempt.missed
        );
        missedPerQuestion[indexMissed] += 1;
      });
    }
  });
  return [correctPerQuestion, incorrectPerQuestion, missedPerQuestion];
};

const getLabels = (amountQuestions) => {
  const labels = [];
  for (let i = 0; i < amountQuestions; i++) {
    labels.push('Vraag ' + parseInt(i + 1));
  }
  return labels;
};

const BarGraph = (props) => {
  const { questionGroup, title } = props;
  const amountQuestions = questionGroup.questions.length;
  const questionIds = [];
  questionGroup.questions.forEach((question) => {
    questionIds.push(question.id);
  });

  const distributions = calculateDistribution(
    questionGroup.questionGroupAttempts,
    amountQuestions,
    questionIds
  );
  const data = {
    datasets: [
      {
        label: 'Aantal juiste antwoorden',
        data: distributions[0],
      },
      {
        label: 'Aantal incorrect antwoorden',
        data: distributions[1],
      },
      {
        label: 'Aantal gemiste antwoorden',
        data: distributions[2],
      },
    ],
    labels: getLabels(amountQuestions),
  };

  return (
    <Paper>
      <Title>{title}</Title>
      <Bar data={data} />
    </Paper>
  );
};

export default BarGraph;
