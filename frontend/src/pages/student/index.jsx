import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Paper from '@material-ui/core/Paper';
import service from '../../service';

const useStyles = makeStyles((theme) => ({}));

const Header = (props) => {
  const { name, id } = props;
  return (
    <List
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Leerling
        </ListSubheader>
      }
    >
      <ListItem alignItems="flex-start" key={id}>
        <ListItemText primary={name} />
      </ListItem>
    </List>
  );
};

const Course = (props) => {
  const { name, id } = props;
  console.log(props);
  return (
    <ListItem alignItems="flex-start" key={id} button>
      <ListItemText
        primary={name}
        secondary={
          <Typography component="span" variant="body2" color="textPrimary">
            test
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="comments">
          <ArrowForwardIosIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const Courses = (props) => {
  const { courses } = props;
  return (
    <List
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Cursussen
        </ListSubheader>
      }
    >
      <Paper>
        {courses.map((course) => (
          <Course {...course} />
        ))}
      </Paper>
    </List>
  );
};

const Student = (props) => {
  const classes = useStyles();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);
  const [courses, setCourses] = useState([]);

  const loadCourses = async () => {
    const studentId = params.studentId;
    const response = await service.loadCourses({ studentId });
    if (!response) {
      return;
    }
    setCourses(response.body.data);
  };

  const loadStudent = async () => {
    const studentId = params.studentId;
    const response = await service.loadStudent(studentId);
    if (!response) {
      return;
    }
    setStudent(response.body.data);
  };

  const loadAll = async () => {
    setLoading(true);
    loadCourses();
    loadStudent();
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Header {...student} />
      </Grid>
      <Grid item xs={12}>
        <Courses courses={courses} />
      </Grid>
    </Grid>
  );
};

export default observer(Student);
