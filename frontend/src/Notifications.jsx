import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles(() => ({
  topGrid: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    marginRight: '-1%',
  },

  notification: {
    color: 'white',
    backgroundColor: 'red',
    marginLeft: '-35%',
    marginTop: '-60%',
    width: '50%',
    height: '70%',
    fontSize: 15,
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const Notifications = (props) => {
  const { notificationStore } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [amountNotifications, setAmountNotifications] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(notificationStore.isNotificationDisplay);

      const boolNotification = isNotification(notificationStore.accumulator);

      if (boolNotification) {
        notificationStore.setNotificationDisplay('');
        console.log(notificationStore.isNotificationDisplay);
        console.log(notificationStore.accumulator);
      }
      notificationStore.pushAccumulator();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { lessonStore } = props;

  const checkNotifications = (counter) => {
    return counter === 10;
  };

  const isNotification = (acc) => {
    return acc === 10;
  };

  const classes = useStyles();
  return (
    <Grid container xs={3} md={3} className={classes.topGrid}>
      <Grid item xs={3} md={3}>
        <IconButton color="inherit" onClick={handleClick}>
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
            {/* <Avatar
            className={classes.notification}
            style={{ display: notificationStore.isNotificationDisplay }}
          >
            {amountNotifications}
          </Avatar> */}
          </Badge>
        </IconButton>
      </Grid>
      <StyledMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Sent mail" />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <DraftsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <InboxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </StyledMenuItem>
      </StyledMenu>
    </Grid>
  );
};
export default observer(Notifications);
