import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import PageContainer from '../_shared/PageContainer';
import service from '../../service';
import Doughnut from './Doughnut';

const Details = (props) => {
  const [questionGroupAttempts, setQuestionGroupAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const loadQuestionGroupAttempts = useCallback(async () => {
    setLoading(true);

    const response = await service.loadQuestionGroupAttempts(
      params.questionGroupId
    );

    if (!response) {
      return;
    }
    
    const data = response.body.data.filter((attempt) => attempt.isCompleted);
    setQuestionGroupAttempts(data);
    setLoading(false);
  }, [params.questionGroupId]);

  useEffect(() => {
    loadQuestionGroupAttempts();
  }, [loadQuestionGroupAttempts]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Doughnut
            questionGroupAttempts={questionGroupAttempts}
            title="Correctheid verdeling van de vraag"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '2rem', height: '100%' }}>
            <Typography>Meer data visualisatie</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '2rem', height: '100%' }}>
            <Typography>Meer data visualisatie</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '2rem', height: '100%' }}>
            <Typography>Meer data visualisatie</Typography>
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Details;
