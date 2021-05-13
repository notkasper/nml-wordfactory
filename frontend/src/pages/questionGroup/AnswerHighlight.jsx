import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  answer: (props) => ({
    background: getColor(props.correct),

    width: '100%',
  }),
}));

const getColor = (isCorrect) => {
  if (isCorrect) {
    return '#C5E6A6';
  } else {
    return 'white';
  }
};

const AnswerHighlight = (props) => {
  const classes = useStyles(props);
  return <Typography className={classes.answer}> {props.answer}</Typography>;
};

export default AnswerHighlight;
