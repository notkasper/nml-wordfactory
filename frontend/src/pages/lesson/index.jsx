import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useParams } from 'react-router-dom';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import { DataGrid } from '@material-ui/data-grid';
import request from 'superagent';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({}));

const columns = [
  {
    field: 'name',
    headerName: 'Naam',
    width: 130,
    valueGetter: (params) => params.getValue('student').name,
  },
  { field: 'isStarted', headerName: 'Gestart', width: 130 },
  { field: 'isCompleted', headerName: 'Voltooid', width: 130 },
  {
    field: 'duration',
    headerName: 'Duratie (minuten)',
    width: 180,
  },
  { field: 'Correct', headerName: 'Correct', width: 130, type: 'number' },
  { field: 'Incorrect', headerName: 'Incorrect', width: 130, type: 'number' },
];

const addDuration = (lessonAttempts) => {
  return lessonAttempts.map((lessonAttempt) => {
    const duration = lessonAttempt.questionGroupAttempts.reduce(
      (acc, curr) => acc + curr.timeElapsedSeconds,
      0
    );
    lessonAttempt.duration = Math.round(duration / 60);
    return lessonAttempt;
  });
};

const Lesson = (props) => {
  const classes = useStyles();
  const params = useParams();
  const [lessonAttempts, setLessonAttempts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLessonAttempts = async () => {
    setLoading(true);
    const response = await request
      .get(`/api/v1/lessonAttempts`)
      .query({ lessonId: params.lessonId });
    let loadedLessonAttempts = response.body.data;
    loadedLessonAttempts = addDuration(loadedLessonAttempts);
    setLessonAttempts(loadedLessonAttempts);
    setLoading(false);
  };

  useEffect(() => {
    loadLessonAttempts();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <DataGrid
      autoHeight
      rows={lessonAttempts}
      columns={columns}
      pageSize={32}
      checkboxSelection
    />
  );
};

export default Lesson;
