import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import QuestionGroup from '../_shared/QuestionGroup';
import service from '../../service';

const Question = (props) => {
  const { authStore } = props;
  const [questionGroup, setQuestionGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const loadQuestionGroup = useCallback(async () => {
    setLoading(true);
    const response = await service.loadQuestionGroups([params.questionGroupId]);
    if (!response) {
      return;
    }
    setQuestionGroup(response.body.data[0]);
    setLoading(false);
  }, [params.questionGroupId]);

  useEffect(() => {
    loadQuestionGroup();
  }, [loadQuestionGroup]);

  const save = async (questionId, newData) => {
    setLoading(true);
    const response = await service.updateQuestion(questionId, newData);
    setLoading(false);
    if (!response) {
      return;
    }
    authStore.setSuccess('Vraag succesvol geüpdatet');
    await loadQuestionGroup();
  };

  if (loading || !questionGroup) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
        <QuestionGroup {...questionGroup} save={save} />
      </Grid>
    </Grid>
  );
};

export default Question;
