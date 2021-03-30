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

const MultipleChoice = (props) => {
  const { id } = props;
  const classes = useStyles();
  const [value, setValue] = useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // TODO WFT-72: Sometimes multiple choice questions have multiple nested multiple choice questions inside.. for now only show the first one
  let data = props.data;
  if (data.morphemes?.length) {
    data = props.data.morphemes[0];
  }

  return (
    <ListItem alignItems="flex-start" key={id}>
      <Grid container>
        <Grid item xs={12}>
          <Typography>{data.value}</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              Selecteer het juiste antwoord
            </FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={value}
              onChange={handleChange}
            >
              {data.options.map((option) => (
                <FormControlLabel
                  value={option.value}
                  control={<Radio />}
                  label={option.value}
                  disabled
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default MultipleChoice;
