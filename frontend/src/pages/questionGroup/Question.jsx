import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import QuestionGroup from '../_shared/QuestionGroup';
import service from '../../service';

const Question = (props) => {
  const { authStore } = props;
  const [questionGroups, setQuestionGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const loadQuestionGroups = useCallback(async () => {
    setLoading(true);
    const response = await service.loadQuestionGroups([params.questionGroupId]);
    if (!response) {
      return;
    }
    setQuestionGroup(response.body.data);
    setLoading(false);
  }, [params.questionGroupId]);

  useEffect(() => {
    loadQuestionGroups();
  }, [loadQuestionGroups]);

  const save = async (questionId, newData) => {
    setLoading(true);
    const response = await service.updateQuestion(questionId, newData);
    setLoading(false);
    if (!response) {
      return;
    }
    authStore.setSuccess('Vraag succesvol geüpdatet');
    await loadQuestionGroups();
  };

  if (loading || !questionGroups) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
        <QuestionGroup {...questionGroups[0]} save={save} />
      </Grid>
    </Grid>
  );
};

export default Question;
