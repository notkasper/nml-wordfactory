import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContent from '../_shared/TabContent';
import Details from './Insights';
import Question from './Question';
import EqualizerIcon from '@material-ui/icons/Equalizer';

const QuestionStats = (props) => {
  const [value, setValue] = useState('question');

  const onChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={value} onChange={onChangeTab}>
          <Tab
            label="Inzicht (opdracht)"
            icon={<EqualizerIcon />}
            value="insights"
          />
          <Tab label="Opdracht" icon={<VisibilityIcon />} value="question" />
        </Tabs>
      </AppBar>
      <TabContent index="question" value={value}>
        <Question {...props} />
      </TabContent>
      <TabContent index="insights" value={value}>
        <Details {...props} />
      </TabContent>
    </>
  );
};

export default QuestionStats;
