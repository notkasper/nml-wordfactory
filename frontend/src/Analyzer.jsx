import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import request from 'superagent';
import Divider from '@material-ui/core/Divider';
import { useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LineChart from './LineChart';
import { clusterWeekly } from './utils';

const TODOS = [
  'Be able to pick year',
  'send feedback of progress using sockets or something',
  'generate grouped bar chart',
  'add line chart for weekly occurences of post',
];

const Analyzer = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [ticker, setTicker] = useState('');
  const analyze = async () => {
    if (!ticker.length) {
      return;
    }
    console.log(`Please analyze: ${ticker}`);
    setLoading(true);
    const response = await request.get(`/api/v1/stocks/${ticker}`);
    setPosts(response.body.data.posts);
    setLoading(false);
  };
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">Stock Sentiment Analyzer</Typography>
        </Toolbar>
      </AppBar>
      <CssBaseline />
      <Container maxWidth="md">
        <Grid container spacing={2} style={{ marginTop: '.5rem' }}>
          <Grid item xs={8}>
            <TextField
              id="standard-basic"
              label="Input stock ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchRoundedIcon />}
              disabled={loading}
              onClick={analyze}
              style={{ marginTop: '.5rem' }}
            >
              Analyze
            </Button>
          </Grid>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">TODO</Typography>
        </Grid>
        <ul>
          {TODOS.map((todo) => (
            <li key={todo}>
              <Typography>{todo}</Typography>
            </li>
          ))}
        </ul>
        <Grid item xs={12} style={{ marginTop: '3rem' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <LineChart
              data={clusterWeekly(posts)}
              title="Average sentiment over time"
              color={theme.palette.primary.main}
            />
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Analyzer;
