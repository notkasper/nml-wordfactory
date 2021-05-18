import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Title from '../_shared/Title';
import { Bar } from 'react-chartjs-2';

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

const Histogram = (props) => {
  const { lessonAttempts, title } = props;
  const classes = useStyles();
  const gradeDistribution = lessonAttempts.reduce(
    (acc, curr) => {
      const index = curr.performance;
      acc[index - 1] += 1;
      return acc;
    },
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  );

  const data = {
    datasets: [
      {
        label: 'Aantal leerlingen',
        data: gradeDistribution,
      },
    ],
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <Paper className={fixedHeightPaper}>
      <Title>{title}</Title>
      <Bar data={data} />
    </Paper>
  );
};

export default Histogram;
