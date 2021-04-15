import React, { useState, useEffect, useCallback } from 'react';
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
        <Grid item xs={12}>
          <Courses courses={courses} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default observer(Student);
