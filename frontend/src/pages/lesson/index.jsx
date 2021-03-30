import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PieChartIcon from '@material-ui/icons/PieChart';
import EditIcon from '@material-ui/icons/Edit';
import Insights from './Insights';
import Questions from './LessonContent';
import TabContent from '../_shared/TabContent';

const useStyles = makeStyles((theme) => ({}));

const Lesson = (props) => {
  const [value, setValue] = useState(0);

  const onChangeTab = (event, newValue) => setValue(newValue);

  return (
    <>
      <AppBar position="static">
        <Tabs value={value} onChange={onChangeTab}>
          <Tab label="Inzichten" icon={<PieChartIcon />} />
          <Tab label="Opdrachten" icon={<EditIcon />} />
        </Tabs>
      </AppBar>
      <TabContent index={0} value={value}>
        <Insights />
      </TabContent>
      <TabContent index={1} value={value}>
        <Questions />
      </TabContent>
    </>
  );
};

export default Lesson;
