import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const Lesson = (props) => {
  const { name, id, prefix } = props;
  const history = useHistory();
  const location = useLocation();
  const onClick = () => history.push(`${location.pathname}/lessons/${id}`);

  return (
    <ListItem
      component="div"
      alignItems="flex-start"
      key={id}
      button
      onClick={onClick}
    >
      <ListItemText primary={`${prefix} - ${name}`} />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="comments">
          <ArrowForwardIosIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default Lesson;
