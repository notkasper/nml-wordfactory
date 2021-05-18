import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 4, 0, 4),
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  account: {
    margin: theme.spacing(4),
  },
  label: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
  },
}));

const AccountInformation = (props) => {
  const classes = useStyles();

  // TODO: contains mocked data, need to retrieve this via store
  return (
    <Grid container>
      <Grid item xs={12} className={classes.divider}>
        <Typography variant="h5" className={classes.header}>
          Account Informatie
        </Typography>
        <Divider />
        <Grid container className={classes.account}>
          <Grid item xs={12} md={3}>
            <Typography className={classes.label}>Gebruikersnaam</Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <TextField
              disabled
              value={'bertvis1971'}
              className={classes.fullWidth}
            />
          </Grid>
        </Grid>
        <Grid container className={classes.account}>
          <Grid item xs={12} md={3}>
            <Typography className={classes.label}>E-mailadres</Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <TextField
              disabled
              value={'b.vis@outlook.com'}
              className={classes.fullWidth}
            />
          </Grid>
        </Grid>
        <Grid container className={classes.account}>
          <Grid item xs={12} md={3}>
            <Typography className={classes.label}>Wachtwoord</Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <TextField
              disabled
              type="password"
              value={'superuser'}
              className={classes.fullWidth}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AccountInformation;
