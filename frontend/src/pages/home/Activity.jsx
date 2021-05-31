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
import PageContainer from '../_shared/PageContainer';

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
    valueGetter: (params) => params.row.lessonAttempts.student.name,
  },
  {
    field: 'lesson',
    headerName: 'Les',
    flex: 0.2,
    valueGetter: (params) => params.row.lesson.prefix,
  },
  {
    field: 'question',
    headerName: 'Vraag',
    flex: 0.2,
    valueGetter: (params) => params.row.questionGroup.index + 1,
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
  const [questionGroupAttempts, setQuestionGroupAttempts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadQuestionGroupAttempts = useCallback(async () => {
    setLoading(true);

    const response = await service.loadQuestionGroupAttempts({ pageSize: 10 });
    if (!response) {
      return;
    }

    setQuestionGroupAttempts(response.body.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadQuestionGroupAttempts();

    return () => {
      setQuestionGroupAttempts([]);
    };
  }, [loadQuestionGroupAttempts]);

  if (loading) {
    return <CircularProgress />;
  }

  const onClickStudent = (event) =>
    history.push(`/dashboard/students/${event.row.lessonAttempts.student.id}`);

  return (
    <PageContainer>
      <Title>Recente leerlingen activiteit</Title>
      <Grid item xs={12}>
        <DataGrid
          className={classes.datagrid}
          autoHeight
          rows={questionGroupAttempts}
          columns={columns}
          pageSize={5}
          onRowClick={onClickStudent}
        />
      </Grid>
    </PageContainer>
  );
};

export default Activity;
