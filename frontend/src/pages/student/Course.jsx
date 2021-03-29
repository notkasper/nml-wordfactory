import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Lesson from './Lesson';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%',
  },
}));

const Course = (props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const onChange = () => setExpanded(!expanded);
  const { name, id, lessons } = props;
  return (
    <ListItem alignItems="flex-start" key={id}>
      <Accordion
        className={classes.fullWidth}
        TransitionProps={{ unmountOnExit: true }}
        expanded={expanded}
        onChange={onChange}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Lessen
              </ListSubheader>
            }
            style={{ width: '100%' }}
          >
            {lessons.map((lesson, index) => (
              <Lesson {...lesson} />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
};

export default Course;
