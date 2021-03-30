import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import PageContainer from '../_shared/PageContainer';
import service from '../../service';

const LessonContent = (props) => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const loadLesson = async () => {
    setLoading(true);
    const response = await service.loadLesson(params.lessonId);
    if (!response) {
      return;
    }
    setLesson(response.body.data);
    setLoading(false);
  };

  useEffect(() => {
    loadLesson();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  console.log(lesson);

  return <PageContainer>Here will be questions</PageContainer>;
};

export default LessonContent;
