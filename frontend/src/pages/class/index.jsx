import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import Student from './Student';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Pagination from '@material-ui/lab/Pagination';
import service from '../../service';
import Course from './Course';

const PAGE_SIZE = 7;

const useStyles = makeStyles((theme) => ({
  marginBottom: {
    marginBottom: '1rem',
  },
  pagination: {
    margin: '1rem auto',
  },
}));

const Lesson = (props) => {
  const classes = useStyles();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [theClass, setTheClass] = useState([]);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [studentFilterValue, setStudentFilterValue] = useState(null);
  const [studentFilterInputValue, setStudentFilterInputValue] = useState('');

  const [courseFilterValue, setCourseFilterValue] = useState(null);
  const [courseFilterInputValue, setCourseFilterInputValue] = useState('');

  const loadStudents = async () => {
    const response = await service.loadStudents(params.classId);
    if (!response) return;
    setStudents(response.body.data);
  };

  const loadClass = async () => {
    const response = await service.loadClass(params.classId);
    if (!response) return;
    setTheClass(response.body.data);
  };

  const loadCourses = async () => {
    const response = await service.loadCourses(params.classId);
    if (!response) return;
    setCourses(response.body.data);
  };

  const loadAll = async () => {
    setLoading(true);
    const promises = [loadStudents(), loadCourses(), loadClass()];
    await Promise.all(promises);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onStudentFilterInputChange = (event, newInputValue) => {
    setStudentFilterInputValue(newInputValue);
  };

  const onStudentFilterChange = (event, newValue) => {
    setStudentFilterValue(newValue);
  };

  const onCourseFilterInputChange = (event, newInputValue) => {
    setCourseFilterInputValue(newInputValue);
  };

  const onCourseFilterChange = (event, newValue) => {
    setCourseFilterValue(newValue);
  };

  const onChangePage = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return <CircularProgress />;
  }

  const renderStudents = () => {
    const start = page * PAGE_SIZE;

    const shownStudents = studentFilterValue
      ? [studentFilterValue]
      : students.slice(start, start + PAGE_SIZE);

    return (
      <List className={classes.root}>
        {shownStudents.map((student) => (
          <Student {...student} key={student.id} />
        ))}
      </List>
    );
  };

  const renderCourses = () => {
    const start = page * PAGE_SIZE;

    const shownCourses = courseFilterValue
      ? [courseFilterValue]
      : courses.slice(start, start + PAGE_SIZE);

    return (
      <List className={classes.root}>
        {shownCourses.map((course) => (
          <Course {...course} />
        ))}
      </List>
    );
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.marginBottom}>
            {theClass.name}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
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
          <Paper>{renderCourses()}</Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" className={classes.marginBottom}>
            Leerlingen
          </Typography>
          <Autocomplete
            value={studentFilterValue}
            onChange={onStudentFilterChange}
            inputValue={studentFilterInputValue}
            onInputChange={onStudentFilterInputChange}
            id="combo-box-demo"
            options={students}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Leerling zoeken"
                variant="outlined"
              />
            )}
          />
          <Divider style={{ margin: '1rem 0' }} />
          <Paper>{renderStudents()}</Paper>
          {studentFilterValue ? null : (
            <Pagination
              className={classes.pagination}
              count={Math.ceil(students.length / 10)}
              color="primary"
              onChange={onChangePage}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default observer(Lesson);
