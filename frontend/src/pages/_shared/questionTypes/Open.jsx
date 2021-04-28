import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '60%',
  },
}));

const ClickTheRightWords = (props) => {
  const { id } = props;
  const classes = useStyles();

  return (
    <ListItem alignItems="flex-start" key={id}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="body1" className={classes.fullWidth}>
            {`${props.index + 1}. ${props.instruction}`}
          </Typography>
          <TextField
            disabled
            className={classes.fullWidth}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default ClickTheRightWords;
