import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import DehazeIcon from '@material-ui/icons/Dehaze';
import ListSubheader from '@material-ui/core/ListSubheader';

const useStyles = makeStyles((theme) => ({}));

const Course = (props) => {
  const { id, name, lessons } = props;
  const classes = useStyles();
  const history = useHistory();

  const goToLesson = (id) => {
    history.push(`/dashboard/lessons/${id}`);
  };

  return (
    <div>
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {name}
          </ListSubheader>
        }
      >
        {lessons.map((lesson) => (
          <ListItem alignItems="flex-start" key={lesson.id}>
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
                <DehazeIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Course;
