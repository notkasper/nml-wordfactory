import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

const CustomBreadcrumbs = (props) => {
  const { crumbs } = props;
  const history = useHistory();

  function handleClick(event, crumb) {
    event.preventDefault();
    history.push(crumb.path);
  }

  return (
    <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: '1rem' }}>
      <Typography variant="body2">Locatie:</Typography>
      {crumbs.map((crumb) => (
        <Link
          key={crumb.path}
          component="button"
          color="inherit"
          onClick={(event) => handleClick(event, crumb)}
        >
          {crumb.name}
        </Link>
      ))}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbs;
