import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import PageContainer from '../_shared/PageContainer';
import QuestionAttempts from './QuestionAttempts';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

const StudentLesson = (props) => {
  const classes = useStyles();

  return (
    <PageContainer>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <QuestionAttempts {...props} />
        </Paper>
      </Grid>
    </PageContainer>
  );
};

export default StudentLesson;
