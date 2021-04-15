import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PageContainer from '../_shared/PageContainer';

const Profile = (props) => {
  return (
    <PageContainer>
      <Grid item xs={12} md={12} lg={12}>
        <Paper>
          <p>Hier komt het profiel</p>
        </Paper>
      </Grid>
    </PageContainer>
  );
};

export default Profile;
