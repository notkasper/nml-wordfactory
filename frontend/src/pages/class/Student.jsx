import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';

const useStyles = makeStyles((theme) => ({}));

const getIcon = (isBottom) => {
  return isBottom ? <EmojiObjectsIcon style={{ color: 'orange' }} /> : null;
};

const Student = (props) => {
  const { id, name, email, onClick, isBottom } = props;
  const classes = useStyles();

  return (
    <ListItem
      component="div"
      alignItems="flex-start"
      key={id}
      button
      style={{ alignItems: 'center' }}
      onClick={onClick}
    >
      <ListItemIcon>{getIcon(isBottom)}</ListItemIcon>{' '}
      <ListItemAvatar>
        <Avatar alt="Travis Howard" />
      </ListItemAvatar>
      <ListItemText
        primary={name}
        secondary={
          <Typography
            component="span"
            variant="body2"
            className={classes.inline}
            color="textPrimary"
          >
            {email || 'geen email'}
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="comments">
          <ArrowForwardIosIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default Student;
