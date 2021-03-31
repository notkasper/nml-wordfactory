import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router-dom';
import PageContainer from '../_shared/PageContainer';
import QuestionGroup from '../_shared/QuestionGroup';
import service from '../../service';

const Question = (props) => {
  const [questionGroup, setQuestionGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const history = useHistory();

  const loadQuestionGroup = async () => {
    setLoading(true);
    const response = await service.loadQuestionGroup(params.questionGroupId);
    if (!response) {
      return;
    }
    setQuestionGroup(response.body.data);
    setLoading(false);
  };

  useEffect(() => {
    loadQuestionGroup();
  }, []);

  const enableEdit = () => {
    // TODO: make editable
  };

  if (loading || !questionGroup) {
    return <CircularProgress />;
  }

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={enableEdit}
            disabled
          >
            Vraag aanpassen
          </Button>
        </Grid>
        <Grid item xs={12}>
          <QuestionGroup {...questionGroup} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Question;
