import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';

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
    field: 'questionGroup',
    headerName: 'Vraag groep',
    flex: 0.4,
    valueGetter: (params) => params.row.Question.questions.name,
  },
  {
    field: 'questionGroupIndex',
    headerName: 'Vraag groep index',
    flex: 0.2,
    valueGetter: (params) => params.row.Question.questions.index + 1,
  },
  {
    field: 'question',
    headerName: 'Vraag nummer',
    flex: 0.2,
    valueGetter: (params) => params.row.Question.index + 1,
  },
];

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  datagrid: {
    marginTop: '1rem',
    '& .MuiDataGrid-row:hover': {
      cursor: 'pointer',
    },
  },
}));

const Activity = (props) => {
  const classes = useStyles();
  const params = useParams();
  const [questionAttempts, setQuestionAttempts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const loadQuestionAttempts = useCallback(async () => {
    setLoading(true);

    const response = await service.loadQuestionAttempts({
      studentId: params.studentId,
      lessonId: params.lessonId,
    });

    if (!response) {
      return;
    }

    setQuestionAttempts(response.body.data);
    setLoading(false);
  }, [params.studentId, params.lessonId]);

  useEffect(() => {
    loadQuestionAttempts();
  }, [loadQuestionAttempts]);

  const handleModalOpen = (event) => {
    setModalContent(event.row);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalContent({});
  };

  if (loading) {
    return <CircularProgress />;
  }

  const Body = () => (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">Antwoord</h2>
      <p id="simple-modal-description">
        {JSON.stringify(modalContent.content)}
      </p>
    </div>
  );

  return (
    <React.Fragment>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Body />
      </Modal>
      <Title>Antwoorden</Title>
      <Grid item xs={12}>
        <DataGrid
          className={classes.datagrid}
          autoHeight
          rows={questionAttempts}
          columns={columns}
          pageSize={5}
          onRowClick={(event) => handleModalOpen(event)}
        />
      </Grid>
    </React.Fragment>
  );
};

export default Activity;
