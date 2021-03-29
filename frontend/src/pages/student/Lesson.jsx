import React from 'react';
import { useHistory } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const Lesson = (props) => {
  const history = useHistory();
  const { name, id, prefix } = props;
  const onClick = () => history.push(`lessons/${id}`);

  return (
    <ListItem alignItems="flex-start" key={id} button onClick={onClick}>
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
