import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import PageContainer from '../_shared/PageContainer';
import service from '../../service';
import Courses from './Courses';
import ProfileHeader from './ProfileHeader';

const Student = () => {
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
    const promises = [loadCourses(), loadStudent()];
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
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ProfileHeader {...student} />
        </Grid>
        <Grid item xs={12}>
          <Courses courses={courses} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default observer(Student);
