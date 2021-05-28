import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';

import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';

import Title from '../_shared/Title';

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
    headerName: 'Opdracht',
    flex: 0.4,
    valueGetter: (params) => params.row.question.questions.name,
  },
  {
    field: 'questionGroupIndex',
    headerName: 'Opdracht index',
    flex: 0.2,
    valueGetter: (params) => params.row.question.questions.index + 1,
  },
  {
    field: 'question',
    headerName: 'Vraag nummer',
    flex: 0.2,
    valueGetter: (params) => params.row.question.index + 1,
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

const QuestionAttempts = (props) => {
  const classes = useStyles();
  const { questionAttempts } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const handleModalOpen = (event) => {
    setModalContent(event.row);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalContent({});
  };

  const Body = React.forwardRef((props, ref) => (
    <div {...props} className={classes.paper} ref={ref}>
      <h2 id="simple-modal-title">Antwoord</h2>
      <p id="simple-modal-description">{JSON.stringify(modalContent.answer)}</p>
    </div>
  ));

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

export default QuestionAttempts;
