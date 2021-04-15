import React, { useState, useEffect } from 'react';
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
  const classId = params.classId;

  const loadStudents = async () => {
    const response = await service.loadStudents(classId);
    if (!response) return;
    setStudents(response.body.data);
  };

  const loadClass = async () => {
    const response = await service.loadClass(classId);
    if (!response) return;
    setTheClass(response.body.data);
  };

  const loadCourses = async () => {
    const response = await service.loadCourses({ classId });
    if (!response) return;
    setCourses(response.body.data);
  };

  const loadAll = async () => {
    setLoading(true);
    const promises = [loadStudents(), loadCourses(), loadClass()];
    await Promise.all(promises);
    setLoading(false);
  };

  const onChangeTab = (event, newValue) => setValue(newValue);

  useEffect(() => {
    loadAll();
  }, []);

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
