import React, { useState, useEffect, useCallback } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
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
    width: 200,
    renderCell: (params) => convertDateToReadableString(params.row.updatedAt),
  },
  {
    field: 'student',
    headerName: 'Leerling',
    width: 200,
    valueGetter: (params) => params.row.LessonAttempt.student.name,
  },
  {
    field: 'lesson',
    headerName: 'Les',
    width: 200,
    valueGetter: (params) => params.row.QuestionGroup.questionGroups.prefix,
  },
  {
    field: 'question',
    headerName: 'Vraag',
    width: 100,
    valueGetter: (params) => params.row.QuestionGroup.index + 1,
  },
  {
    field: 'isCompleted',
    headerName: 'Voltooid',
    width: 125,
    renderCell: (params) =>
      params.row.isCompleted ? <DoneRoundedIcon /> : <CloseRoundedIcon />,
  },
  {
    field: 'Leerling bekijken',
    headerName: '',
    width: 200,
    renderCell: (params) => (
      <ViewIcon id={params.row.LessonAttempt.student.id} />
    ),
  },
];

const ViewIcon = (props) => {
  const { id } = props;
  const history = useHistory();
  const goToStats = () => history.push(`/dashboard/students/${id}`);
  return (
    <IconButton onClick={goToStats}>
      <VisibilityIcon color="primary" />
    </IconButton>
  );
};

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const Activity = (props) => {
  const classes = useStyles();
  const [questionAttempts, setQuestionAttempts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadQuestionAttempts = useCallback(async () => {
    setLoading(true);

    const response = await service.loadQuestionAttempts();
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

  return (
    <React.Fragment>
      <Title>Recente leerlingen activiteit</Title>
      <Grid item xs={12}>
        <DataGrid
          autoHeight
          rows={questionAttempts}
          columns={columns}
          pageSize={5}
        />
      </Grid>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more activity
        </Link>
      </div>
    </React.Fragment>
  );
};

export default Activity;
