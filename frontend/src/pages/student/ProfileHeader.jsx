import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  title: {
    textAlign: 'center',
    background: 'black',
    color: 'white',
    alignItems: 'baseline',
    display: 'flex',
    justifyContent: 'center',
  },
}));

const ProfileHeader = (props) => {
  const { name } = props;
  const classes = useStyles();
  return (
    <Paper className={classes.title}>
      <Typography style={{ variant: 'h5' }}> Naam Leerling: </Typography>
      <Typography style={{ variant: 'h6', marginLeft: '10%' }}>
        {name}
      </Typography>
    </Paper>
  );
};

export default ProfileHeader;
