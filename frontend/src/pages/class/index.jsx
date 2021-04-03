import React, { useState, useEffect, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PeopleIcon from '@material-ui/icons/People';
import service from '../../service';
import Courses from './Courses';
import Students from './Students';
import PageContainer from '../_shared/PageContainer';
import TabContent from '../_shared/TabContent';

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
  const [value, setValue] = useState(0);
  const [students, setStudents] = useState([]);
  const [theClass, setTheClass] = useState([]);
  const [courses, setCourses] = useState([]);

  const loadStudents = useCallback(async () => {
    const response = await service.loadStudents(params.classId);
    if (!response) return;
    setStudents(response.body.data);
  }, [params.classId]);

  const loadClass = useCallback(async () => {
    const response = await service.loadClass(params.classId);
    if (!response) return;
    setTheClass(response.body.data);
  }, [params.classId]);

  const loadCourses = useCallback(async () => {
    const classId = params.classId;
    const response = await service.loadCourses({ classId });
    if (!response) return;
    setCourses(response.body.data);
  }, [params.classId]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const promises = [loadStudents(), loadCourses(), loadClass()];
    await Promise.all(promises);
    setLoading(false);
  }, [loadClass, loadStudents, loadCourses]);

  const onChangeTab = (event, newValue) => setValue(newValue);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <AppBar position="static">
        <Tabs value={value} onChange={onChangeTab}>
          <Tab label="Cursussen" icon={<MenuBookIcon />} />
          <Tab label="Studenten" icon={<PeopleIcon />} />
        </Tabs>
      </AppBar>
      <PageContainer>
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.marginBottom}>
            {theClass.name}
          </Typography>
        </Grid>
        <TabContent index={0} value={value}>
          <Courses courses={courses} />
        </TabContent>
        <TabContent index={1} value={value}>
          <Students students={students} />
        </TabContent>
      </PageContainer>
    </>
  );
};

export default observer(Lesson);
