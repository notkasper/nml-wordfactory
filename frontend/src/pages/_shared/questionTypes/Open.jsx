import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

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
        <Grid item xs={12} md={6} className={classes.fullWidth}>
          <Typography variant="body1">
            {`${props.index + 1}. ${props.instruction}`}
          </Typography>
          <TextField
            disabled
            multiline
            rows={4}
            className={classes.fullWidth}
          />
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default ClickTheRightWords;
