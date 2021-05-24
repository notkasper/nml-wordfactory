import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useParams, useHistory } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import PercentageDoughnut from '../_shared/PercentageDoughnut';
import service from '../../service';
import PageContainer from '../_shared/PageContainer';

const InsightsDuring = (props) => {
  const theme = useTheme();
  //const classes = useStyles();
  const history = useHistory();
  const { lessonStore } = props;
  const params = useParams();

  //const params = useParams();

  useEffect(() => {
    lessonStore.loadLessonAttempts(params.lessonId);
  }, [lessonStore, params.lessonId]);

  if (lessonStore.isLoading) {
    return <CircularProgress />;
  }

  const data = ({ color, variant }) => ({
    datasets: [
      {
        data: [100 - variant * 25, variant * 25],
        backgroundColor: ['rgb(0, 0, 0, 0)', color],
      },
    ],
  });
  console.log(lessonStore.lessonAttempts);
  const options = ({ color, text }) => ({
    cutoutPercentage: 75,
    tooltips: { enabled: false },
    hover: { mode: null },
    responsive: true,
    elements: {
      center: {
        text,
        color: color || '#FFFFFF',
      },
    },
  });

  return (
    <PageContainer> </PageContainer>
    // <PageContainer>
    //   <Grid container spacing={3}>
    //     {/* Average percentage statistics */}
    //     <PercentageDoughnut
    //       title="Gemiddelde correctheid"
    //       data={data({ color: theme.widget.primary.main, variant: 1 })}
    //       options={options({ color: theme.widget.primary.main, text: '25%' })}
    //     />
    //     <PercentageDoughnut
    //       title="Gemiddelde voortgang"
    //       data={data({ color: theme.widget.secondary.main, variant: 2 })}
    //       options={options({ color: theme.widget.secondary.main, text: '50%' })}
    //     />
    //     <PercentageDoughnut
    //       title="Opdrachten nagekeken"
    //       data={data({ color: theme.widget.tertiary.main, variant: 3 })}
    //       options={options({ color: theme.widget.tertiary.main, text: '75%' })}
    //     />
    //     {/* Recent activity */}
    //     <Grid item xs={12}>
    //       <Paper className={classes.paper}>
    //         <Activity />
    //       </Paper>
    //     </Grid>
    //   </Grid>
    // </PageContainer>
  );
};

export default InsightsDuring;
