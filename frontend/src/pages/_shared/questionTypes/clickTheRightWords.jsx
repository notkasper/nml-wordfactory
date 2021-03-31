import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%',
  },
}));

const ClickTheRightWords = (props) => {
  const { id } = props;
  const classes = useStyles();

  return (
    <ListItem alignItems="flex-start" key={id}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="body1" className={classes.marginBottom}>
            {/* {instruction} */}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>Oh oh, dit wordt nog niet ondersteund.</Typography>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default ClickTheRightWords;
