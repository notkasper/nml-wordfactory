import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Bar } from 'react-chartjs-2';
import Title from '../_shared/Title';

const useStyles = makeStyles((theme) => ({
  histogram: {
    display: 'flex',
    justifyContent: 'center',
    component: 'h2',
    variant: 'h6',
    textAlign: 'center',
  },
}));

const calculateDistribution = (
  questionGroupAttempts,
  amountQuestions,
  questionIds
) => {
  let correctPerQuestion = Array.apply(null, Array(amountQuestions)).map(
    Number.prototype.valueOf,
    0
  );

  questionGroupAttempts.forEach((questionGroupAttempt) => {
    if (questionGroupAttempt.isCompleted) {
      questionGroupAttempt.questionAttempts.forEach((questionAttempt) => {
        const index = questionIds.findIndex(
          (el) => el === questionAttempt.questionId
        );
        correctPerQuestion[index] += 1;
      });
    }
  });
  return correctPerQuestion;
};

const getLabels = (amountQuestions) => {
  let labels = [];
  for (let i = 0; i < amountQuestions; i++) {
    labels.push('Vraag ' + parseInt(i + 1));
  }
  return labels;
};

const BarGraph = (props) => {
  const { questionGroup, title } = props;
  const amountQuestions = questionGroup.questions.length;
  let questionIds = [];
  questionGroup.questions.forEach((question) => {
    questionIds.push(question.id);
  });

  const data = {
    datasets: [
      {
        label: 'Aantal juiste antwoorden',
        data: calculateDistribution(
          questionGroup.questionGroupAttempts,
          amountQuestions,
          questionIds
        ),
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
