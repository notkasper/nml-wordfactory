import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useParams, useLocation } from 'react-router-dom';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import routes from '../../routes';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

const CustomBreadcrumbs = (props) => {
  const { crumbs } = props;

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {crumbs.map((crumb) => (
        <Link color="inherit" href={crumb.path} onClick={handleClick}>
          {crumb.name}
        </Link>
      ))}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbs;
