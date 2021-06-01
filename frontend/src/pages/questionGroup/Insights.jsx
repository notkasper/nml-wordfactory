import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import BarGraph from './BarGraph';
import Grid from '@material-ui/core/Grid';
import Doughnut from './Doughnut';
import Tile from './Tile';
import { observer } from 'mobx-react-lite';

const Insights = (props) => {
  const { questionStore } = props;
  const theme = useTheme();
  const params = useParams();

  const loadAll = useCallback(async () => {
    await questionStore.loadQuestionGroupsWithAttempts(params.questionGroupId);
  }, [questionStore, params.questionGroupId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (questionStore.isLoading || !questionStore.questionGroups) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Doughnut
          questionGroupAttempts={
            questionStore.questionGroups[0].questionGroupAttempts
          }
          title="Correctheid verdeling van de vragen"
        />
      </Grid>
      <Grid item xs={12} md={6} style={{ padding: '1rem' }}>
        <Tile
          questionGroup={questionStore.questionGroups[0]}
          title="Totaal aantal vragen: "
          number={1}
          color={theme.widget.tertiary.main}
        />
        <Tile
          questionGroup={questionStore.questionGroups[0]}
          title="Gemiddelde tijdsduur opdracht: "
          number={2}
          color={theme.widget.secondary.main}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <BarGraph
          questionGroup={questionStore.questionGroups[0]}
          title="Correctheid verdeling per vraag"
        />
      </Grid>
    </Grid>
  );
};

export default observer(Insights);
