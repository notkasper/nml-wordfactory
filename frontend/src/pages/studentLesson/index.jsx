import React, { useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import BarGraph from './BarGraph'; // TODO (working on this): IF we want to implement all question types
import CircularProgress from '@material-ui/core/CircularProgress';
import PageContainer from '../_shared/PageContainer';
import QuestionAttempts from './QuestionAttempts';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

const StudentLesson = (props) => {
  const { questionStore } = props;
  const classes = useStyles();
  const params = useParams();

  const loadAll = useCallback(async () => {
    await questionStore.loadQuestionAttemptsWithInfo(
      params.studentId,
      params.lessonId
    );
  }, [questionStore, params.studentId, params.lessonId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (questionStore.isLoading) {
    return <CircularProgress />;
  }

  return (
    <PageContainer>
      {/* / TODO (working on this): IF we want to implement all question types
      <Grid item xs={12} md={12}>
        <BarGraph
          questionAttempts={questionStore.questionAttempts}
          title="Correctheid verdeling per vraag"
        />
      </Grid> */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <QuestionAttempts questionAttempts={questionStore.questionAttempts} />
        </Paper>
      </Grid>
    </PageContainer>
  );
};

export default StudentLesson;
