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

// TODO: this is duplicate code! Make sure to create store for this and then call shared _utils.js
const convertCategoryToString = (category) => {
  const conversion = {
    learning_process: 'Leerproces',
    recognizing_morphemes_sentence: 'Herkennen morfemen in een zin',
    meaning_morphemes: 'Betekenis morfemen',
    splitsing_morphemes: 'Splits morfemen',
    create_morphemes_prefix: 'Creëren morfemen (voorvoegsel)',
    background_morphemes: 'Alternatieve betekenis morfemen',
    recognizing_morphemes_text: 'Herkennen morfemen in een tekst',
    intuition: 'Intuïtie',
    create_alternative_morphemes: 'Creëren alternatieve morfemen',
    create_morphemes_suffix: 'Creëren morfemen (achtervoegsel)',
    create_new_morphemes: 'Creëren nieuwe morfemen',
  };

  return conversion[category];
};

const Student = (props) => {
  const classes = useStyles();
  const params = useParams();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);

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

  const loadStudentCategories = useCallback(async () => {
    const studentId = params.studentId;
    const response = await service.loadStudentCategories(studentId);
    if (!response) {
      return;
    }
    setCategories(response.body.data);
  }, [params.studentId]);

  const loadAll = useCallback(async () => {
    setLoading(true);

    const promises = [loadCourses(), loadStudent(), loadStudentCategories()];
    await Promise.all(promises);

    setLoading(false);
  }, [loadCourses, loadStudent, loadStudentCategories]);

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
              {categories.slice(0, 3).map((category, index) => (
                <ProgressBar
                  key={category.key}
                  title={`${index + 1}. ${convertCategoryToString(
                    category.key
                  )}`}
                  value={category.correctness}
                />
              ))}
            </Paper>
          </PaperWithHeader>
          <PaperWithHeader
            headercolor={theme.widget.secondary.main}
            headertitle="Top categorieën"
          >
            <Paper className={classes.paper}>
              {categories.slice(-3).map((category, index) => (
                <ProgressBar
                  key={category.key}
                  title={`${index + 1}. ${convertCategoryToString(
                    category.key
                  )}`}
                  value={category.correctness}
                />
              ))}
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
