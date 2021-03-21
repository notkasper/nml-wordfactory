import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Title from '../home/Title';
import { Doughnut } from 'react-chartjs-2';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 300,
  },
}));

const Histogram = (props) => {
  const { lessonAttempts, title } = props;
  const classes = useStyles();
  const params = useParams();
  const [loading, setLoading] = useState(false);
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

  if (loading) {
    return <CircularProgress />;
  }

  const data = {
    datasets: [
      {
        data: [notStarted, started, completed],
        backgroundColor: ['#0088FE', '#00C49F', '#FFBB28'],
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

export default Histogram;
