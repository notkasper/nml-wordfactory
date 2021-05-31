import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
  const theme = useTheme();
  const { lessonAttempts, title } = props;
  const classes = useStyles();
  const { started, completed, notStarted } = lessonAttempts.reduce(
    (acc, curr) => {
      if (curr.isCompleted) {
        acc.completed += 1;
      } else if (curr.isStarted) {
        acc.started += 1;
      } else {
        acc.notStarted += 1;
      }
      return acc;
    },
    { started: 0, completed: 0, notStarted: 0 }
  );

  useEffect(() => {}, []);

  const data = {
    datasets: [
      {
        data: [notStarted, started, completed],
        backgroundColor: [
          theme.statistics.red.main,
          theme.statistics.orange.main,
          theme.statistics.green.main,
        ],
      },
    ],
    labels: ['Niet begonnen', 'Begonnen', 'Voltooid'],
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
