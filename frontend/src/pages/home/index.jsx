import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';

import Activity from './Activity';
import Widget from './Widget';
import PercentageDoughnut from './PercentageDoughnut';
import service from '../../service';
import PageContainer from '../_shared/PageContainer';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

const Dashboard = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const [, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadClasses = useCallback(async () => {
    setLoading(true);

    const response = await service.loadClasses();
    if (!response) {
      return;
    }

    setClassList(response.body.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  if (loading) {
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
    <PageContainer>
      <Grid container spacing={3}>
        {/* Widgets with general information */}
        <Widget
          left={6}
          right="lessen"
          color={theme.widget.primary.main}
          onClick={() => history.push('/dashboard/lessons')}
        />
        <Widget
          left={206}
          right="leerlingen"
          color={theme.widget.secondary.main}
          onClick={() => history.push('/dashboard/students')}
        />
        <Widget
          left={25}
          right="na te kijken opdrachten"
          color={theme.widget.tertiary.main}
          onClick={() => history.push('/dashboard/tasks')}
        />
        {/* Average percentage statistics */}
        <PercentageDoughnut
          title="Gemiddelde correctheid"
          data={data({ color: theme.widget.primary.main, variant: 1 })}
          options={options({ color: theme.widget.primary.main, text: '25%' })}
        />
        <PercentageDoughnut
          title="Gemiddelde voortgang"
          data={data({ color: theme.widget.secondary.main, variant: 2 })}
          options={options({ color: theme.widget.secondary.main, text: '50%' })}
        />
        <PercentageDoughnut
          title="Opdrachten nagekeken"
          data={data({ color: theme.widget.tertiary.main, variant: 3 })}
          options={options({ color: theme.widget.tertiary.main, text: '75%' })}
        />
        {/* Recent activity */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Activity />
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Dashboard;
