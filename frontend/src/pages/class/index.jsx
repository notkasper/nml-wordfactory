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

const tabs = ['insights', 'lessons', 'students'];
const mapTabToIndex = (tab) => tabs.indexOf(tab);
const mapIndexToTab = (index) => tabs[index];

const Lesson = (props) => {
  const { crumbs } = props;
  const classes = useStyles();
  const history = useHistory();
  const params = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(mapTabToIndex(params.tab));
  const [students, setStudents] = useState([]);
  const [theClass, setTheClass] = useState([]);
  const [courses, setCourses] = useState([]);
  const classId = params.classId;

  const loadStudents = useCallback(async () => {
    const response = await service.loadStudents({ classId });
    if (!response) return;
    setStudents(response.body.data);
  }, [classId]);

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

  const onClickTab = (event, tabIndex) => {
    const currentTab = params.tab;
    const newTab = mapIndexToTab(tabIndex);
    const newPath = location.pathname.replace(currentTab, newTab);
    history.push(newPath);
  };

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // for updating the current tab when the URL changes
  useEffect(() => {
    setValue(mapTabToIndex(params.tab));
  }, [params.tab]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <AppBar position="static">
        <Tabs value={value} onChange={onClickTab}>
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
        <TabContent index={0} value={value}>
          <Insight />
        </TabContent>
        <TabContent index={1} value={value}>
          <Courses courses={courses} />
        </TabContent>
        <TabContent index={2} value={value}>
          <Students students={students} />
        </TabContent>
      </PageContainer>
    </>
  );
};

export default observer(Lesson);
