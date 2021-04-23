import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

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

  const data = ({ color }) => ({
    datasets: [
      {
        data: [27, 73],
        backgroundColor: ['rgb(0, 0, 0, 0)', color],
      },
    ],
  });

  const options = ({ color }) => ({
    cutoutPercentage: 75,
    tooltips: { enabled: false },
    hover: { mode: null },
    responsive: true,
    elements: {
      center: {
        text: '73%',
        color: color || '#FFFFFF',
      },
    },
  });

  return (
    <PageContainer>
      <Grid container spacing={3}>
        {/* Widgets with general information */}
        <Widget left={6} right="lessen" color={theme.widget.primary.main} />
        <Widget
          left={104}
          right="leerlingen"
          color={theme.widget.secondary.main}
        />
        <Widget
          left={25}
          right="na te kijken opdrachten"
          color={theme.widget.tertiary.main}
        />
        {/* Average percentage statistics */}
        <PercentageDoughnut
          title="Gemiddelde correctheid"
          data={data({ color: theme.widget.primary.main })}
          options={options({ color: theme.widget.primary.main })}
        />
        <PercentageDoughnut
          title="Gemiddelde voortgang"
          data={data({ color: theme.widget.secondary.main })}
          options={options({ color: theme.widget.secondary.main })}
        />
        <PercentageDoughnut
          title="Gemiddelde tijdsduur"
          data={data({ color: theme.widget.tertiary.main })}
          options={options({ color: theme.widget.tertiary.main })}
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
