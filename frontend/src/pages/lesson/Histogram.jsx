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
  let gradeDistribution = lessonAttempts.reduce(
    (acc, curr) => {
      const index = Math.floor(curr.performance);
      acc[index] += 1;
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
    labels: [
      '0-1',
      '1-2',
      '2-3',
      '3-4',
      '4-5',
      '5-6',
      '6-7',
      '7-8',
      '8-9',
      '9-10',
    ],
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
