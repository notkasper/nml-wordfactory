import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import FaceIcon from '@material-ui/icons/Face';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

const drawerWidth = 245;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const Menu = (props) => {
  const { authStore } = props;
  const classes = useStyles();
  const history = useHistory();

  const goToClasses = () => history.push('/dashboard/home');
  const logout = () => {
    authStore.logout();
    history.push('/');
  };

  return (
    <Drawer
      variant="permanent"
      className={classes.drawerPaper}
      open
      style={{ paddingTop: '50px' }}
    >
      <List style={{ padding: 0 }}>
        <div style={{ marginTop: '64px', padding: 0 }} />
        <Divider />
        <ListSubheader inset>Leraren dashboard</ListSubheader>
        <ListItem button onClick={goToClasses}>
          <ListItemIcon>
            <FaceIcon />
          </ListItemIcon>
          <ListItemText primary="Klassen" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListSubheader inset>Persoonlijke instellingen</ListSubheader>
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

export default Menu;
