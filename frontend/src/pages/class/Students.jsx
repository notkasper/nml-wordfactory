import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import List from '@material-ui/core/List';
import Student from './Student';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Pagination from '@material-ui/lab/Pagination';

const PAGE_SIZE = 20;

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: '1rem',
  },
  marginBottom: {
    marginBottom: '1rem',
  },
}));

const Students = (props) => {
  const { students } = props;
  const classes = useStyles();
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [studentFilterValue, setStudentFilterValue] = useState(null);
  const [studentFilterInputValue, setStudentFilterInputValue] = useState('');

  const onStudentFilterInputChange = (event, newInputValue) => {
    setStudentFilterInputValue(newInputValue);
  };

  const onStudentFilterChange = (event, newValue) => {
    setStudentFilterValue(newValue);
  };

  const onChangePage = (event, value) => {
    setPage(value);
  };

  const start = page * PAGE_SIZE;

  const shownStudents = studentFilterValue
    ? [studentFilterValue]
    : students.slice(start, start + PAGE_SIZE);

  const onClick = (studentId) =>
    history.push(`/dashboard/students/${studentId}`);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" className={classes.marginBottom}>
          Leerlingen
        </Typography>
        <Autocomplete
          value={studentFilterValue}
          onChange={onStudentFilterChange}
          inputValue={studentFilterInputValue}
          onInputChange={onStudentFilterInputChange}
          options={students}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Leerling zoeken" variant="outlined" />
          )}
        />
        <Divider style={{ margin: '1rem 0' }} />
        <Paper>
          <List className={classes.root}>
            {shownStudents.map((student) => (
              <Student
                key={student.id}
                {...student}
                onClick={() => onClick(student.id)}
              />
            ))}
          </List>
        </Paper>
        {studentFilterValue ? null : (
          <Pagination
            className={classes.marginTop}
            count={Math.ceil(students.length / 10)}
            color="primary"
            onChange={onChangePage}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Students;
