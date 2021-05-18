import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import PageContainer from '../_shared/PageContainer';
import service from '../../service';
import Courses from './Courses';
import ProfileHeader from './ProfileHeader';
import Progress from './Progress';
import PaperWithHeader from '../_shared/PaperWithHeader';
import ProgressBar from '../_shared/ProgressBar';

const useStyles = makeStyles((theme) => ({
  widget: {
    height: 230,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(12),
  },
  paper: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    height: 230,
    padding: theme.spacing(3),
  },
}));

const Student = (props) => {
  const classes = useStyles();
  const params = useParams();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);
  const [courses, setCourses] = useState([]);

  const loadCourses = useCallback(async () => {
    const studentId = params.studentId;
    const response = await service.loadCourses({ studentId });
    if (!response) {
      return;
    }
    setCourses(response.body.data);
  }, [params.studentId]);

  const loadStudent = useCallback(async () => {
    const studentId = params.studentId;
    const response = await service.loadStudent(studentId);
    if (!response) {
      return;
    }
    setStudent(response.body.data);
  }, [params.studentId]);

  const loadAll = useCallback(async () => {
    setLoading(true);

    const promises = [loadCourses(), loadStudent()];
    await Promise.all(promises);

    setLoading(false);
  }, [loadCourses, loadStudent]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ProfileHeader {...student} />
        </Grid>
        <Grid container spacing={3} className={classes.widget}>
          <Grid item xs={12}>
            <Progress courses={courses} />
          </Grid>

          <PaperWithHeader
            headercolor={theme.widget.secondary.main}
            headertitle="Probleem categorieën"
          >
            <Paper className={classes.paper}>
              <ProgressBar title="1. Herken morfemen in woorden" value={38} />
              <ProgressBar title="2. Herken morfemen in een zin" value={48} />
              <ProgressBar title="3. Verwisselen morfemen" value={55} />
            </Paper>
          </PaperWithHeader>
          <PaperWithHeader
            headercolor={theme.widget.secondary.main}
            headertitle="Top categorieën"
          >
            <Paper className={classes.paper}>
              <ProgressBar title="1. Betekenis morfemen" value={97} />
              <ProgressBar title="2. Splits morfemen" value={83} />
              <ProgressBar
                title="3. Alternatieve betekenis morfemen"
                value={74}
              />
            </Paper>
          </PaperWithHeader>
          <Grid item xs={12}>
            <Courses courses={courses} />
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default observer(Student);
