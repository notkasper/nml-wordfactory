import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import CircularProgress from '@material-ui/core/CircularProgress';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import GroupRoundedIcon from '@material-ui/icons/GroupRounded';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import SchoolRoundedIcon from '@material-ui/icons/SchoolRounded';
import ImportContactsRoundedIcon from '@material-ui/icons/ImportContactsRounded';
import NoMeetingRoomRoundedIcon from '@material-ui/icons/NoMeetingRoomRounded';
import service from './service';

const drawerWidth = 245;

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    width: drawerWidth,
    color: theme.palette.text.secondary,
    '&:hover > $content': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

const StyledTreeItem = (props) => {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          {LabelIcon && (
            <LabelIcon color="inherit" className={classes.labelIcon} />
          )}
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
};

const useStyles = makeStyles({});

const Menu = (props) => {
  const { authStore } = props;
  const classes = useStyles();
  const history = useHistory();
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadClasses = async () => {
    setLoading(true);
    const response = await service.loadClasses();
    if (response) {
      setClassList(response.body.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const onNodeSelect = (event, value) => {
    if (value === '/') {
      authStore.logout(); // logout route
    }
    history.push(value);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TreeView
      className={classes.root}
      defaultExpanded={['/dashboard/classes']}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      onNodeSelect={onNodeSelect}
    >
      <div style={{ marginTop: '64px', padding: 0 }} />
      <Divider />
      <ListSubheader inset>Leraren dashboard</ListSubheader>
      <StyledTreeItem
        nodeId="/dashboard/home"
        labelText="Overzicht"
        labelIcon={HomeRoundedIcon}
      />
      <StyledTreeItem
        nodeId="/dashboard/classes"
        labelText="Klassen"
        labelIcon={SchoolRoundedIcon}
      >
        {classList.map((classItem) => (
          <StyledTreeItem
            key={classItem.id}
            nodeId={`/dashboard/classes/${classItem.id}`}
            labelText={classItem.name}
            // labelInfo="3"
            color="#1a73e8"
            bgColor="#e8f0fe"
          />
        ))}
      </StyledTreeItem>
      <StyledTreeItem
        nodeId="/dashboard/students"
        labelText="Leerlingen"
        labelIcon={GroupRoundedIcon}
      />
      <StyledTreeItem
        nodeId="/dashboard/lessons"
        labelText="Lessen"
        labelIcon={ImportContactsRoundedIcon}
      />
      <StyledTreeItem
        nodeId="/"
        labelText="Uitloggen"
        labelIcon={NoMeetingRoomRoundedIcon}
      />
    </TreeView>
  );
};

export default Menu;
