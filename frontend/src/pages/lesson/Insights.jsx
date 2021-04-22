import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { observer } from 'mobx-react-lite';
import Doughnut from './Doughnut';
import Histogram from './Histogram';
import PageContainer from '../_shared/PageContainer';

const calculateProgress = (questionGroupAttempts = []) => {
  const total = questionGroupAttempts.length;
  const completed = questionGroupAttempts.reduce((prev, curr) => {
    if (curr.isCompleted) {
      prev += 1;
    }

    return prev;
  }, 0);

  return total !== 0 ? Math.floor((completed / total) * 100) : 100;
};

const columns = [
  {
    field: 'name',
    headerName: 'Naam',
    flex: 0.3,
    valueGetter: (params) => params.row.student.name,
  },
  {
    field: 'progress',
    headerName: 'Voortgang (%)',
    flex: 0.15,
    valueGetter: (params) => calculateProgress(params.row.questionGroupAttempts),
  },
  {
    field: 'duration',
    headerName: 'Duratie (minuten)',
    flex: 0.15,
  },
  { field: 'correct', headerName: 'Correct', flex: 0.1, type: 'number' },
  { field: 'incorrect', headerName: 'Incorrect', flex: 0.1, type: 'number' },
  { field: 'performance', headerName: 'Prestatie', flex: 0.1, type: 'number' },
];

const Lesson = (props) => {
  const { lessonStore } = props;
  const params = useParams();

  useEffect(() => {
    lessonStore.loadLessonAttempts(params.lessonId);
  }, [lessonStore, params.lessonId]);

  if (lessonStore.isLoading) {
    return <CircularProgress />;
  }

  return (
    <PageContainer maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Doughnut
            lessonAttempts={lessonStore.lessonAttempts}
            title="Algemene voortgang"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Histogram
            lessonAttempts={lessonStore.lessonAttempts}
            title="Cijfer verdeling"
          />
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <DataGrid
              autoHeight
              rows={lessonStore.lessonAttempts}
              columns={columns}
              pageSize={12}
              checkboxSelection
            />
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default observer(Lesson);
