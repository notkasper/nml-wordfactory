import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PageContainer from '../_shared/PageContainer';

const useStyles = makeStyles((theme) => ({}));

const Profile = (props) => {
  const { authStore } = props;
  const classes = useStyles();
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
