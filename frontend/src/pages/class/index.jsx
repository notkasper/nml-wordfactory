import React, { useState, useEffect, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PeopleIcon from '@material-ui/icons/People';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import service from '../../service';
import Insight from './Insight';
import Courses from './Courses';
import Students from './Students';
import PageContainer from '../_shared/PageContainer';
import TabContent from '../_shared/TabContent';
import Breadcrumbs from '../_shared/Breadcrumbs';

const useStyles = makeStyles((theme) => ({
  marginBottom: {
    marginBottom: '1rem',
  },
  pagination: {
    margin: '1rem auto',
  },
}));

const Lesson = (props) => {
  const { crumbs, studentStore } = props;
  const classes = useStyles();
  const history = useHistory();
  const params = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [theClass, setTheClass] = useState([]);
  const [courses, setCourses] = useState([]);

  const classId = params.classId;

  const loadStudents = useCallback(async () => {
    await studentStore.loadStudents({ classId });
  }, [studentStore, classId]);

  const loadClass = useCallback(async () => {
    const response = await service.loadClass(params.classId);
    if (!response) return;
    setTheClass(response.body.data);
  }, [params.classId]);

  const loadCourses = useCallback(async () => {
    const response = await service.loadCourses({ classId });
    if (!response) return;
    setCourses(response.body.data);
  }, [classId]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const promises = [loadStudents(), loadCourses(), loadClass()];
    await Promise.all(promises);
    setLoading(false);
  }, [loadClass, loadStudents, loadCourses]);

  const onClickTab = (event, newTab) => {
    const currentTab = params.classTab;
    const newPath = location.pathname.replace(currentTab, newTab);
    history.push(newPath);
  };

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (loading || studentStore.isLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <AppBar position="static">
        <Tabs value={params.classTab} onChange={onClickTab}>
          <Tab label="Inzicht (klas)" icon={<EqualizerIcon />} />
          <Tab label="Lessen" icon={<MenuBookIcon />} />
          <Tab label="Leerlingen" icon={<PeopleIcon />} />
        </Tabs>
      </AppBar>
      <PageContainer>
        <Breadcrumbs crumbs={crumbs} />
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.marginBottom}>
            {theClass.name}
          </Typography>
        </Grid>
        <TabContent index="class_insights" value={params.classTab}>
          <Insight
            topResults={studentStore.topResults}
            bottomResults={studentStore.bottomResults}
          />
        </TabContent>
        <TabContent index="class_lessons" value={params.classTab}>
          <Courses courses={courses} />
        </TabContent>
        <TabContent index="class_students" value={params.classTab}>
          <Students
            students={studentStore.students}
            bottomResults={studentStore.bottomResults}
          />
        </TabContent>
      </PageContainer>
    </>
  );
};

export default observer(Lesson);
