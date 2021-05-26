import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { DataGrid } from '@material-ui/data-grid';
import { useHistory } from 'react-router-dom';
import PageContainer from '../_shared/PageContainer';
import Title from '../_shared/Title';

const convertDateToReadableString = (date) => {
  return `${date.substring(0, 10)} ${date.substring(11, 19)}`;
};

const columns = [
  {
    field: 'updatedAt',
    headerName: 'Datum',
    flex: 0.2,
  },
  {
    field: 'student',
    headerName: 'Leerling',
    flex: 0.2,
  },
  {
    field: 'question',
    headerName: 'Opdracht',
    flex: 0.2,
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

const getRows = (questionGroups) => {
  const rows = [];
  questionGroups.forEach((gp) => {
    const index = gp.index + 1;

    gp.questionGroupAttempts.forEach((qga) => {
      rows.push({
        id: qga.id,
        updatedAt: convertDateToReadableString(qga.updatedAt),
        student: qga.lessonAttempts.student.name,
        question: index,
        isCompleted: qga.isCompleted,
        lessonAttempts: qga.lessonAttempts,
      });
    });
  });

  return rows;
};
const Activity = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { questionGroups } = props;

  const onClickStudent = (event) =>
    history.push(`/dashboard/students/${event.row.lessonAttempts.student.id}`);

  return (
    <PageContainer>
      <Title>Recente leerlingen activiteit</Title>
      <Grid item xs={12}>
        <DataGrid
          className={classes.datagrid}
          autoHeight
          rows={getRows(questionGroups)}
          columns={columns}
          pageSize={5}
          onRowClick={onClickStudent}
        />
      </Grid>
    </PageContainer>
  );
};

export default Activity;
