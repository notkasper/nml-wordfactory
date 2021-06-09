import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { observer } from 'mobx-react-lite';
import Doughnut from './Doughnut';

const columns = [
  {
    field: 'name',
    headerName: 'Naam',
    flex: 0.2,
    valueGetter: (params) => params.row.student.name,
  },
  {
    field: 'duration',
    headerName: 'Tijdsduur (minuten)',
    flex: 0.15,
  },
  { field: 'correct', headerName: 'Correct', flex: 0.1, type: 'number' },
  { field: 'incorrect', headerName: 'Incorrect', flex: 0.1, type: 'number' },
  { field: 'performance', headerName: 'Cijfer', flex: 0.1, type: 'number' },
];

const useStyles = makeStyles((theme) => ({
  datagrid: {
    marginTop: '1rem',
    '& .MuiDataGrid-row:hover': {
      cursor: 'pointer',
    },
  },
}));

const InsightsAfter = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const params = useParams();

  const { lessonStore } = props;

  useEffect(() => {
    lessonStore.loadLessonAttempts(params.lessonId);
  }, [lessonStore, params.lessonId]);

  if (lessonStore.isLoading) {
    return <CircularProgress />;
  }

  const onClickStudent = (event) =>
    history.push(`/dashboard/students/${event.row.student.id}`);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Doughnut
          lessonAttempts={lessonStore.lessonAttempts}
          title="Algemene voortgang"
        />
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <DataGrid
            className={classes.datagrid}
            autoHeight
            rows={lessonStore.lessonAttempts}
            columns={columns}
            pageSize={12}
            onRowClick={onClickStudent}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default observer(InsightsAfter);
