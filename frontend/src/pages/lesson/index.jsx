import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles((theme) => ({}));

const Lesson = (props) => {
  const { authStore } = props;
  const classes = useStyles();
  const history = useHistory();

  return (
    <Grid container component="main" className={classes.root}>
      <p>Lesson details</p>
    </Grid>
  );
};

export default observer(Lesson);
