import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import PageContainer from '../_shared/PageContainer';
import QuestionGroup from '../_shared/QuestionGroup';
import service from '../../service';

const Question = (props) => {
  const [questionGroup, setQuestionGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const params = useParams();

  const loadQuestionGroup = useCallback(async () => {
    setLoading(true);
    const response = await service.loadQuestionGroup(params.questionGroupId);
    if (!response) {
      return;
    }
    setQuestionGroup(response.body.data);
    setLoading(false);
  }, [params.questionGroupId]);

  useEffect(() => {
    loadQuestionGroup();
  }, [loadQuestionGroup]);

  const save = (newData) => {
    console.log(newData);
    console.log('saving new data...');
  };

  if (loading || !questionGroup) {
    return <CircularProgress />;
  }

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <QuestionGroup {...questionGroup} save={save} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Question;
