import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import { observer } from 'mobx-react-lite';

import InsightsAfter from './InsightsAfter';
import InsightsDuring from './InsightsDuring';
import Button from '@material-ui/core/Button';

const Lesson = (props) => {
  const [showCategory, setShowCategory] = useState('after');
  const { lessonStore } = props;
  const params = useParams();

  useEffect(() => {
    lessonStore.loadLesson(params.lessonId);
  }, [lessonStore, params.lessonId]);

  if (lessonStore.isLoading) {
    return <CircularProgress />;
  }
  const changeCategory = () => {
    setShowCategory(showCategory === 'during' ? 'after' : 'during');
  };

  const getQuestionGroupIds = () => {
    const ids = [];
    if (lessonStore.lesson) {
      lessonStore.lesson.questionGroups.forEach((qg) => {
        ids.push(qg.id);
      });
      return ids;
    }
  };

  const getContent = () => {
    return showCategory === 'after' ? (
      <InsightsAfter {...props} />
    ) : (
      <InsightsDuring
        questionGroupIds={getQuestionGroupIds()}
        lessonId={params.lessonId}
        classId={params.classId}
        {...props}
      />
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid
        container
        spacing={2}
        style={{ justifyContent: 'center', display: 'flex' }}
      >
        <Grid
          item
          xs={4}
          md={4}
          style={{
            display: 'flex',
            direction: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '2rem',
            paddingTop: '2rem',
          }}
        >
          <Grid item style={{ paddingRight: '1rem' }}>
            <Button
              variant="contained"
              color={showCategory === 'during' ? 'primary' : 'default'}
              onClick={changeCategory}
            >
              Tijdens de les
            </Button>
          </Grid>
          <Grid item style={{ paddingLeft: '1rem' }}>
            <Button
              variant="contained"
              color={showCategory === 'after' ? 'primary' : 'default'}
              onClick={changeCategory}
            >
              Achteraf
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={12}>
        {getContent()}
      </Grid>
    </Grid>
  );
};

export default observer(Lesson);
