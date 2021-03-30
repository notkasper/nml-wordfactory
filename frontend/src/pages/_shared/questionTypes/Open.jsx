import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%',
  },
}));

const Open = (props) => {
  const { name, id } = props;
  const classes = useStyles();
  return (
    <ListItem alignItems="flex-start" key={id}>
      {name}
    </ListItem>
  );
};

export default Open;
