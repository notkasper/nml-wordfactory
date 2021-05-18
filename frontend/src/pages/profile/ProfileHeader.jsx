import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import avatar from '../../assets/bartVis.png';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(24),
    height: theme.spacing(24),
  },
  email: {
    color: 'blue',
    fontWeight: 'bold',
  },
}));

const ProfileHeader = (props) => {
  const classes = useStyles();

  const preventDefault = (event) => event.preventDefault();

  return (
    <Grid container>
      <Grid item xs={12} lg={3}>
        <Avatar src={avatar} className={classes.avatar} />
      </Grid>
      <Grid item xs={12} lg={9}>
        <Typography variant="h3">Bert Vis</Typography>
        <Link href={`mailto:${'b.vis@outlook.com'}`} onClick={preventDefault}>
          <Typography
            className={classes.email}
            style={{ display: 'inline-block', marginRight: 8 }}
          >
            b.vis@outlook.com
          </Typography>
        </Link>
        <Typography style={{ display: 'inline-block' }}>- Docent</Typography>
      </Grid>
    </Grid>
  );
};

export default ProfileHeader;
