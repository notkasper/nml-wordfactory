import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Course from './Course';

const useStyles = makeStyles((theme) => ({
  marginBottom: {
    marginBottom: '1rem',
  },
  pagination: {
    margin: '1rem auto',
  },
}));

const Courses = (props) => {
  const { courses } = props;
  const classes = useStyles();

  const [courseFilterValue, setCourseFilterValue] = useState(null);
  const [courseFilterInputValue, setCourseFilterInputValue] = useState('');

  const onCourseFilterInputChange = (event, newInputValue) => {
    setCourseFilterInputValue(newInputValue);
  };

  const onCourseFilterChange = (event, newValue) => {
    setCourseFilterValue(newValue);
  };

  const shownCourses = courseFilterValue ? [courseFilterValue] : courses;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" className={classes.marginBottom}>
          Cursussen
        </Typography>
        <Autocomplete
          value={courseFilterValue}
          onChange={onCourseFilterChange}
          inputValue={courseFilterInputValue}
          onInputChange={onCourseFilterInputChange}
          id="combo-box-demo"
          options={courses}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Cursus zoeken" variant="outlined" />
          )}
        />
        <Divider style={{ margin: '1rem 0' }} />
        <Paper>
          <List className={classes.root}>
            {shownCourses.map((course) => (
              <Course key={course.id} {...course} />
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Courses;
