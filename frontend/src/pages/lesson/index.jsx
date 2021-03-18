import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import request from 'superagent';
import Student from './Student';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  marginBottom: {
    marginBottom: '1rem',
  },
}));

const Lesson = (props) => {
  const { authStore } = props;
  const classes = useStyles();
  const history = useHistory();
  const params = useParams();
  const [students, setStudents] = useState([]);
  const [lesson, setLesson] = useState([]);

  const loadStudents = async () => {
    const response = await request.get(`/api/v1/lesson/${params.id}/students`);
    setStudents(response.body.data);
  };

  const loadLesson = async () => {
    const response = await request.get(`/api/v1/lesson/${params.id}`);
    setLesson(response.body.data);
  };

  useEffect(() => {
    loadStudents();
    loadLesson();
  }, []);

  console.log(lesson);
  console.log(lesson);
  console.log(lesson);
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.marginBottom}>
            {lesson.prefix}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" className={classes.marginBottom}>
            Leerlingen
          </Typography>
          <Paper>
            <List className={classes.root}>
              {students.map((student) => (
                <Student {...student} />
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default observer(Lesson);
