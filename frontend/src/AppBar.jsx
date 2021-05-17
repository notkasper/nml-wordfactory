import React from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Notifications from './Notifications.jsx';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AccountCircle from '@material-ui/icons/AccountCircle';

const drawerWidth = 245;

const useStyles = makeStyles((theme) => ({
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
  title: {
    flexGrow: 1,
  },
  icons: {
    display: 'flex',
  },
}));

const CustomAppBar = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const goToProfile = () => history.push('/dashboard/profile');
  const goBack = () => history.goBack();

  return (
    <AppBar
      position="absolute"
      className={clsx(classes.appBar, classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton onClick={goBack}>
          <ChevronLeftIcon style={{ color: 'white' }} />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        ></Typography>
        <div className={classes.icons}>
          <Notifications {...props} />
          <IconButton color="inherit" onClick={goToProfile}>
            <AccountCircle />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
