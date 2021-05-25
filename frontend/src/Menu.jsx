import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import TreeView from '@material-ui/lab/TreeView';
import GroupRoundedIcon from '@material-ui/icons/GroupRounded';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import SchoolRoundedIcon from '@material-ui/icons/SchoolRounded';
import NoMeetingRoomRoundedIcon from '@material-ui/icons/NoMeetingRoomRounded';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MenuItem from './pages/_shared/MenuItem';
import service from './service';
import socket from './socket';

const drawerWidth = 245;

const useStyles = makeStyles(() => ({
  drawer: {
    marginRight: drawerWidth,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 0,
  },
}));

const Menu = (props) => {
  const { authStore } = props;
  const classes = useStyles();
  const history = useHistory();
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadClasses = async () => {
    setLoading(true);
    const response = await service.loadClasses();
    if (response) {
      setClassList(response.body.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const onNodeSelect = (event, value) => {
    switch (value) {
      case '/':
        handleDialogOpen();
        break;
      case '/dashboard/classes':
        // do nothing
        break;
      default:
        history.push(value);
    }
  };

  const handleLogout = () => {
    authStore.logout();
    socket.disconnect();
    history.push('/');
    authStore.setSuccess('Succesvol uitgelogd!');
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Drawer variant="permanent" className={classes.drawer}>
      <TreeView
        defaultExpanded={['/dashboard/classes']}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        onNodeSelect={onNodeSelect}
      >
        <div style={{ marginTop: '64px', padding: 0 }} />
        <Divider />
        <MenuItem
          nodeId="/dashboard/home"
          labelText="Overzicht"
          labelIcon={HomeRoundedIcon}
        />
        <MenuItem
          nodeId="/dashboard/classes"
          labelText="Klassen"
          labelIcon={SchoolRoundedIcon}
        >
          {loading
            ? null
            : classList.map((classItem) => (
                <MenuItem
                  key={classItem.id}
                  nodeId={`/dashboard/classes/${classItem.id}/class_insights`}
                  labelText={classItem.name}
                  color="#1a73e8"
                  bgColor="#e8f0fe"
                />
              ))}
        </MenuItem>
        <MenuItem
          nodeId="/dashboard/students"
          labelText="Leerlingen"
          labelIcon={GroupRoundedIcon}
        />
        <MenuItem
          nodeId="/"
          labelText="Uitloggen"
          labelIcon={NoMeetingRoomRoundedIcon}
          className={classes.logoutButton}
        />
      </TreeView>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Uitloggen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Weet je zeker dat je wilt uitloggen?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Annuleren
          </Button>
          <Button onClick={handleLogout} color="primary">
            Uitloggen
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default Menu;
