import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Title from '../_shared/Title';
import { Doughnut } from 'react-chartjs-2';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 400,
  },
}));

const CustomDoughnut = (props) => {
  const { questionGroupAttempts, title } = props;
  const classes = useStyles();
  const { correct, incorrect, missed } = questionGroupAttempts.reduce(
    (acc, curr) => {
      acc.correct += curr.correct;
      acc.incorrect += curr.incorrect;
      acc.missed += curr.missed;
      return acc;
    },
    { correct: 0, incorrect: 0, missed: 0 }
  );

  const data = {
    datasets: [
      {
        data: [correct, incorrect, missed],
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
