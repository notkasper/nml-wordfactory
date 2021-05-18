import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import RestoreIcon from '@material-ui/icons/Restore';

const createRow = (courseName, lessonName, category) => {
  return { courseName, lessonName, category };
};

const getIcon = (category) => {
  let icon = null;
  switch (category) {
    case 'progress':
      icon = <RestoreIcon style={{ color: 'orange' }} />;
      break;
    case 'completed':
      icon = <DoneIcon style={{ color: 'green' }} />;
      break;
    default:
      icon = <ClearIcon style={{ color: 'red' }} />;
  }
  return icon;
};

const getRows = (courses) => {
  const rows = [];

  courses.forEach((course) => {
    const courseName = course.name;
    course.lessons.forEach((lesson) => {
      const lessonName = lesson.name;
      lesson.lessonAttempts.forEach((lessonAttempt) => {
        if (lessonAttempt.isStarted && lessonAttempt.isCompleted) {
          rows.push(createRow(courseName, lessonName, 'completed'));
        } else if (lessonAttempt.isStarted && !lessonAttempt.isCompleted) {
          rows.push(createRow(courseName, lessonName, 'progress'));
        } else {
          rows.push(createRow(courseName, lessonName, 'notstarted'));
        }
      });
    });
  });
  return rows;
};

const Progress = (props) => {
  const { courses } = props;
  const rows = getRows(courses);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Cursus</TableCell>
            <TableCell align="left">Les</TableCell>
            <TableCell align="left">Voortgang</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {index === 0 ? (
                <TableCell rowSpan={rows.length}> {row.courseName}</TableCell>
              ) : null}

              <TableCell align="left">{row.lessonName}</TableCell>
              <TableCell> {getIcon(row.category)} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Progress;
