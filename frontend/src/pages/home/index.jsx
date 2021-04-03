import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chart from './Chart';
import Class from './Class';
import Activity from './Activity';
import service from '../../service';
import PageContainer from '../_shared/PageContainer';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const ClassBox = (props) => {
  const { className, class: classData } = props;
  return (
    <Grid item xs={12} md={4} lg={3}>
      <Paper className={className}>
        <Class {...classData} />
      </Paper>
    </Grid>
  );
};

const Dashboard = (props) => {
  const classes = useStyles();
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadClassList = useCallback(async () => {
    setLoading(true);
    const response = await service.loadClassList();
    if (response) {
      setClassList(response.body.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadClassList();
  }, [loadClassList]);

  if (loading) {
    return <CircularProgress />;
  }

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <PageContainer>
      <Grid container spacing={3}>
        {/* Recent Deposits */}
        {classList.map((aClass) => (
          <ClassBox
            className={fixedHeightPaper}
            class={aClass}
            key={aClass.id}
          />
        ))}
        {/* Chart */}
        <Grid item xs={12} md={12} lg={12}>
          <Paper className={fixedHeightPaper}>
            <Chart />
          </Paper>
        </Grid>
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
