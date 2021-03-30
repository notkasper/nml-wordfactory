import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import PageContainer from '../_shared/PageContainer';
import QuestionGroup from '../_shared/QuestionGroup';
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

  // TODO: Figure out why this is needed, and remove it hopefully
  if (!loading && !lesson) {
    return <p>Les kon niet worden geladen</p>;
  }

  return (
    <PageContainer>
      {lesson.questionGroups.map((questionGroup) => (
        <QuestionGroup {...questionGroup} />
      ))}
    </PageContainer>
  );
};

export default LessonContent;
