import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { observer } from 'mobx-react-lite';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import Doughnut from './Doughnut';
import Histogram from './Histogram';
import PageContainer from '../_shared/PageContainer';

const columns = [
  {
    field: 'name',
    headerName: 'Naam',
    width: 130,
    valueGetter: (params) => params.row.student.name,
  },
  {
    field: 'isStarted',
    headerName: 'Gestart',
    width: 130,
    renderCell: (params) =>
      params.row.isStarted ? <DoneRoundedIcon /> : <CloseRoundedIcon />,
  },
  {
    field: 'isCompleted',
    headerName: 'Voltooid',
    width: 130,
    renderCell: (params) =>
      params.row.isCompleted ? <DoneRoundedIcon /> : <CloseRoundedIcon />,
  },
  {
    field: 'duration',
    headerName: 'Duratie (minuten)',
    width: 165,
  },
  { field: 'correct', headerName: 'Correct', width: 100, type: 'number' },
  { field: 'incorrect', headerName: 'Incorrect', width: 110, type: 'number' },
  { field: 'performance', headerName: 'Prestatie', width: 130, type: 'number' },
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
