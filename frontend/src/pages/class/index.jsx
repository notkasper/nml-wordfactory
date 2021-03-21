import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import Student from './Student';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Course from './Course';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import service from '../../service';

const useStyles = makeStyles((theme) => ({
  marginBottom: {
    marginBottom: '1rem',
  },
}));

const Lesson = (props) => {
  const classes = useStyles();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [theClass, setTheClass] = useState([]);
  const [courses, setCourses] = useState([]);

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

  if (loading) {
    return <CircularProgress />;
  }

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
            Leerlingen
          </Typography>
          <Paper>
            <List className={classes.root}>
              {students.map((student) => (
                <Student {...student} key={student.id} />
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" className={classes.marginBottom}>
            Cursussen
          </Typography>
          <Paper>
            <List className={classes.root}>
              {courses.map((course, index) => (
                <>
                  <Course {...course} />
                  {index + 1 < courses.length ? <Divider /> : null}
                </>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default observer(Lesson);