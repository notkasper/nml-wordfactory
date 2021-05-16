import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
const Progress = (props) => {
  const { courses } = props;
  const theme = useTheme();
  return (
    <Paper
      style={{
        textAlign: 'center',
        background: 'black',
        color: 'white',
        alignItems: 'baseline',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Typography style={{ variant: 'h5' }}> Naam Leerling: </Typography>
    </Paper>
  );
};

export default Progress;
