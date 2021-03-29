import React from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Course from './Course';

const Courses = (props) => {
  const { courses } = props;
  return (
    <List
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Cursussen
        </ListSubheader>
      }
    >
      {courses.map((course) => (
        <Course {...course} />
      ))}
    </List>
  );
};

export default Courses;
