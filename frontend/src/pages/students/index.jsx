import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import PageContainer from '../_shared/PageContainer';
import service from '../../service';

const Students = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  const loadStudents = async () => {
    setLoading(true);
    const response = await service.loadStudents();
    setLoading(false);
    if (!response) {
      return;
    }
    setStudents(response.body.data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <PageContainer>
      <Grid container spacing={2}>
        {students.map((student) => (
          <Grid item xs={12}>
            <p>{student.name || 'student'}</p>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default observer(Students);
