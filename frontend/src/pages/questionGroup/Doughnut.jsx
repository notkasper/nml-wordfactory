import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Title from '../_shared/Title';
import { Doughnut } from 'react-chartjs-2';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    textAlign: 'center',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 400,
  },
}));

const CustomDoughnut = (props) => {
  const theme = useTheme();
  const { questionGroupAttempts, title } = props;
  const classes = useStyles();
  let correct = 0;
  let incorrect = 0;
  let missed = 0;
  questionGroupAttempts.forEach((qga) => {
    qga.questionAttempts.forEach((qa) => {
      correct += qa.correct;
      incorrect += qa.incorrect;
      missed += qa.missed;
    });
  });

  const data = {
    datasets: [
      {
        data: [correct, incorrect, missed],
        backgroundColor: [
          theme.statistics.green.main,
          theme.statistics.red.main,
          theme.statistics.orange.main,
        ],
      },
    ],
    labels: ['Correct', 'Incorrect', 'Gemist'],
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <Paper className={fixedHeightPaper}>
      <Title>{title}</Title>
      <Doughnut data={data} />
    </Paper>
  );
};

export default CustomDoughnut;
