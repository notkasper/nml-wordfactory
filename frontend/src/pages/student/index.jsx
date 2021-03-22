import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({}));

const Student = (props) => {
  const classes = useStyles();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);

  const loadAll = async () => {
    setLoading(true);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        Test test
      </Grid>
    </Grid>
  );
};

export default observer(Student);
