import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '../_shared/PageContainer';
import service from '../../service';

const QuestionStats = (props) => {
  const [questionGroupAttempts, setQuestionGroupAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const loadQuestionGroupAttempts = async () => {
    setLoading(true);
    const response = await service.loadQuestionGroupAttempts(
      params.questionGroupId
    );
    if (!response) {
      return;
    }
    setQuestionGroupAttempts(response.body.data);
    setLoading(false);
  };

  useEffect(() => {
    loadQuestionGroupAttempts();
  }, []);

  return (
    <PageContainer>{questionGroupAttempts.map((e) => e.id)}</PageContainer>
  );
};

export default QuestionStats;
