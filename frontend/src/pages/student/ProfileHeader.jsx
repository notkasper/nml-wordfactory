import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const ProfileHeader = (props) => {
  const { name, id } = props;
  return (
    <List
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Naam leerling
        </ListSubheader>
      }
    >
      <ListItem alignItems="flex-start" key={id}>
        <ListItemText primary={name} />
      </ListItem>
    </List>
  );
};

export default ProfileHeader;
