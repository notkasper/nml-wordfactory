import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import SchoolRoundedIcon from '@material-ui/icons/SchoolRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import Badge from '@material-ui/core/Badge';
import { observer } from 'mobx-react-lite';

import service from './service';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
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
  const [classes, setClasses] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const loadClasses = useCallback(async () => {
    setLoading(true);

    const response = await service.loadClasses();
    if (!response) {
      return;
    }
    setClasses(response.body.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickNotification = (notification) => {
    notificationStore.deleteNotification(notification.index);
    history.push(notification.path);
  };

  if (loading || !classes) {
    return <CircularProgress />;
  }

  return (
    <Grid container>
      <Grid item>
        <IconButton color="inherit" onClick={handleClick}>
          <Badge
            badgeContent={notificationStore.notifications.length}
            color="secondary"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Grid>
      <StyledMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notificationStore.notifications.length ? (
          notificationStore.notifications.map((notification) => (
            <StyledMenuItem
              key={notification.id}
              onClick={() => onClickNotification(notification)}
            >
              <ListItemIcon>
                <SchoolRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={notification.value} />
            </StyledMenuItem>
          ))
        ) : (
          <StyledMenuItem onClick={handleClose}>
            <ListItemText primary="Geen notificaties!" />
          </StyledMenuItem>
        )}
      </StyledMenu>
    </Grid>
  );
};
export default observer(Notifications);
