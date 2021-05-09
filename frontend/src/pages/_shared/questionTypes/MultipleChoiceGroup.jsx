import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%',
  },
}));

const MultipleChoiceGroup = (props) => {
  const { id } = props;
  console.log('Props:', props);
  const classes = useStyles();

  return (
    <ListItem alignItems="flex-start" key={id}>
      <Grid container>
        <Grid item xs={12} md={6} className={classes.fullWidth}></Grid>
      </Grid>
    </ListItem>
  );
};

export default MultipleChoiceGroup;
