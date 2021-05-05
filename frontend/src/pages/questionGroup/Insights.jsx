import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Doughnut from './Doughnut';
import Tile from './Tile';

const Details = (props) => {
  const { questionStore } = props;
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const loadAll = useCallback(async () => {
    setLoading(true);
    const promises = [
      questionStore.loadQuestionGroupAttempts(params.questionGroupId),
      questionStore.loadQuestionGroup(params.questionGroupId),
    ];
    await Promise.all(promises);
    setLoading(false);
  }, [params.questionGroupId, params.questionGroupId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Doughnut
          questionGroupAttempts={questionStore.questionGroupAttempts}
          title="Correctheid verdeling van de vragen"
        />
      </Grid>

      <Grid container xs={12} md={6} style={{ padding: '1rem' }}>
        <Tile
          questionGroup={questionStore.questionGroup}
          title="Totaal aantal vragen: "
          number={1}
          color={theme.widget.tertiary.main}
        />
        <Tile
          questionGroup={questionStore.questionGroup}
          title="Gemiddelde tijdsduur: "
          number={2}
          color={theme.widget.secondary.main}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <Paper style={{ padding: '2rem', height: '100%' }}>Meer dninge</Paper>
      </Grid>
    </Grid>
  );
};

export default Details;
