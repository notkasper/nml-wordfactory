import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%',
  },
}));

const MultipleChoiceGroup = (props) => {
  const { id, index, data } = props;
  const classes = useStyles();

  return (
    <ListItem component="div" alignItems="flex-start" key={id}>
      <Grid container>
        <Grid item xs={12} md={6} className={classes.fullWidth}>
          <Typography>{`${index + 1}. ${data.word}`}</Typography>
        </Grid>
        {(data.morphemes || []).map((morpheme, index) => (
          <Grid item xs={12} key={morpheme.value}>
            <Typography>{morpheme.value}</Typography>
            <RadioGroup>
              {morpheme.options.map((option, index) => (
                <div key={index}>
                  <FormControlLabel
                    value={option.value}
                    disabled
                    control={
                      <Radio color="primary" checked={option.isCorrect} />
                    }
                    label={
                      <TextField
                        value={option.value}
                        placeholder="Nieuw antwoord"
                        disabled
                      />
                    }
                  />
                </div>
              ))}
            </RadioGroup>
          </Grid>
        ))}
      </Grid>
    </ListItem>
  );
};

export default MultipleChoiceGroup;
