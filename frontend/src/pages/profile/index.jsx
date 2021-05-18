import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import PageContainer from '../_shared/PageContainer';
import ProfileHeader from './ProfileHeader';
import AccountInformation from './AccountInformation';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 4, 0, 4),
  },
}));

const Profile = (props) => {
  const classes = useStyles();

  return (
    <PageContainer>
      <Paper className={classes.root}>
        <ProfileHeader />
        <AccountInformation />
      </Paper>
    </PageContainer>
  );
};

export default Profile;
