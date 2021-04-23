import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles((theme) => ({}));

const Course = (props) => {
  const { id, name, lessons } = props;
  const classes = useStyles();
  const history = useHistory();

  const goToLesson = (lessonId) =>
    history.push(`/dashboard/lessons/${lessonId}/insights`);

  return (
    <List
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {name}
        </ListSubheader>
      }
    >
      {lessons.map((lesson) => (
        <ListItem
          alignItems="flex-start"
          key={lesson.id}
          button
          onClick={() => goToLesson(lesson.id)}
        >
          <ListItemText
            primary={`${lesson.prefix} - ${lesson.name}`}
            secondary={
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              ></Typography>
            }
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={() => goToLesson(lesson.id)}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default Course;
