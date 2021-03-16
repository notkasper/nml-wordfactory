import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { useHistory } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    paddingTop: 64,
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const Dashboard = (props) => {
  const { authStore } = props;
  console.log(props.authStore);
  console.log(props.authStore);
  console.log(props.authStore);
  const classes = useStyles();
  const history = useHistory();

  const goToProfile = () => history.push('/profile');
  const goToLessons = () => history.push('/home');
  const logout = () => {
    authStore.logout();
    history.push('/');
  };

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper),
      }}
      open
    >
      <Divider />
      <List>
        <ListSubheader inset>Leraren dashboard</ListSubheader>
        <ListItem button onClick={goToLessons}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Lessen" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListSubheader inset>Persoonlijke instellingen</ListSubheader>
        <ListItem button onClick={goToProfile}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profiel" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <AccountBalanceWalletIcon />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>
        <ListItem button onClick={logout}>
          <ListItemIcon>
            <MeetingRoomIcon />
          </ListItemIcon>
          <ListItemText primary="Uitloggen" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Dashboard;
