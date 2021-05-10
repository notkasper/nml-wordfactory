import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%',
  },
}));

const insertDividers = (word, answer, divider = ' | ') => {
  const spread = divider.length;

  answer.forEach((slice, index) => {
    const pre = word.slice(0, slice + index * spread);
    const post = word.slice(slice + index * spread);
    word = `${pre}${divider}${post}`;
  });

  return word;
};

const DivideTheWord = (props) => {
  const { id, data } = props;
  const classes = useStyles();

  return (
    <ListItem component="div" alignItems="flex-start" key={id}>
      <Grid container>
        <Grid item xs={12} md={6} className={classes.fullWidth}>
          <Typography variant="body1">{`${props.index + 1}. ${
            data.word
          }`}</Typography>
          <Typography>
            {insertDividers(data.word, data.correctAnswer)}
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default DivideTheWord;
