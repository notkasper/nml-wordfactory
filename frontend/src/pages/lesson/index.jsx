import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import service from '../../service';
import Doughnut from './Doughnut';
import Histogram from './Histogram';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({}));

const columns = [
  {
    field: 'name',
    headerName: 'Naam',
    width: 130,
    valueGetter: (params) => params.getValue('student').name,
  },
  { field: 'isStarted', headerName: 'Gestart', width: 130 },
  { field: 'isCompleted', headerName: 'Voltooid', width: 130 },
  {
    field: 'duration',
    headerName: 'Duratie (minuten)',
    width: 165,
  },
  { field: 'correct', headerName: 'Correct', width: 100, type: 'number' },
  { field: 'incorrect', headerName: 'Incorrect', width: 110, type: 'number' },
  { field: 'performance', headerName: 'Prestatie', width: 130, type: 'number' },
];

const addDuration = (lessonAttempts) => {
  return lessonAttempts.map((lessonAttempt) => {
    const duration = lessonAttempt.questionGroupAttempts.reduce(
      (acc, curr) => acc + curr.timeElapsedSeconds,
      0
    );
    lessonAttempt.duration = Math.round(duration / 60);
    return lessonAttempt;
  });
};

const addPerformance = (lessonAttempts) => {
  return lessonAttempts.map((lessonAttempt) => {
    const { correct, incorrect } = lessonAttempt.questionGroupAttempts.reduce(
      (acc, curr) => {
        acc.correct += curr.correct;
        acc.incorrect += curr.incorrect + curr.missed;
        return acc;
      },
      { correct: 0, incorrect: 0 }
    );
    lessonAttempt.correct = correct;
    lessonAttempt.incorrect = incorrect;
    lessonAttempt.performance =
      Math.round((correct / (correct + incorrect)) * 100) / 10 || 0;
    return lessonAttempt;
  });
};

const Lesson = (props) => {
  const classes = useStyles();
  const params = useParams();
  const [lessonAttempts, setLessonAttempts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLessonAttempts = async () => {
    setLoading(true);
    const response = await service.loadLessonAttempts(params.lessonId);
    if (response) {
      let loadedLessonAttempts = response.body.data;
      loadedLessonAttempts = addDuration(loadedLessonAttempts);
      loadedLessonAttempts = addPerformance(loadedLessonAttempts);
      setLessonAttempts(loadedLessonAttempts);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLessonAttempts();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  // TODO: Make this a grid
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} lg={4}>
        <Doughnut lessonAttempts={lessonAttempts} title="Algemene voortgang" />
      </Grid>
      <Grid item xs={12} md={8} lg={8}>
        <Histogram lessonAttempts={lessonAttempts} title="Cijfer verdeling" />
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <DataGrid
            autoHeight
            rows={lessonAttempts}
            columns={columns}
            pageSize={32}
            checkboxSelection
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Lesson;
