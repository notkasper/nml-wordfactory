import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import Grid from '@material-ui/core/Grid';
import Title from '../_shared/Title';
import service from '../../service';

const convertDateToReadableString = (date) => {
  return `${date.substring(0, 10)} ${date.substring(11, 19)}`;
};

const columns = [
  {
    field: 'updatedAt',
    headerName: 'Datum',
    flex: 0.2,
    renderCell: (params) => convertDateToReadableString(params.row.updatedAt),
  },
  {
    field: 'student',
    headerName: 'Leerling',
    flex: 0.2,
    valueGetter: (params) => params.row.LessonAttempt.student.name,
  },
  {
    field: 'lesson',
    headerName: 'Les',
    flex: 0.2,
    valueGetter: (params) => params.row.QuestionGroup.questionGroups.prefix,
  },
  {
    field: 'question',
    headerName: 'Vraag',
    flex: 0.2,
    valueGetter: (params) => params.row.QuestionGroup.index + 1,
  },
  {
    field: 'isCompleted',
    headerName: 'Voltooid',
    flex: 0.2,
    renderCell: (params) =>
      params.row.isCompleted ? <DoneRoundedIcon /> : <CloseRoundedIcon />,
  },
];

const useStyles = makeStyles((theme) => ({
  datagrid: {
    marginTop: '1rem',
    '& .MuiDataGrid-row:hover': {
      cursor: 'pointer',
    },
  },
}));

const Activity = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [questionAttempts, setQuestionAttempts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadQuestionAttempts = useCallback(async () => {
    setLoading(true);

    const response = await service.loadQuestionGroupAttempts({ pageSize: 10 });
    if (!response) {
      return;
    }

    setQuestionAttempts(response.body.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadQuestionAttempts();
  }, [loadQuestionAttempts]);

  if (loading) {
    return <CircularProgress />;
  }

  const onClickStudent = (event) =>
    history.push(`/dashboard/students/${event.row.LessonAttempt.student.id}`);

  return (
    <React.Fragment>
      <Title>Recente leerlingen activiteit</Title>
      <Grid item xs={12}>
        <DataGrid
          className={classes.datagrid}
          autoHeight
          rows={questionAttempts}
          columns={columns}
          pageSize={5}
          onRowClick={onClickStudent}
        />
      </Grid>
    </React.Fragment>
  );
};

export default Activity;
