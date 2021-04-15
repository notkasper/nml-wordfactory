import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContent from '../_shared/TabContent';
import Details from './Insights';
import Question from './Question';
import EqualizerIcon from '@material-ui/icons/Equalizer';

const QuestionStats = (props) => {
  const params = useParams();
  const history = useHistory();
  const [value, setValue] = useState(params.tab);

  const onChangeTab = (event, newValue) => {
    history.push(newValue);
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={value} onChange={onChangeTab}>
          <Tab label="Opdracht" icon={<VisibilityIcon />} value="question" />
          <Tab
            label="Inzicht (opdracht)"
            icon={<EqualizerIcon />}
            value="insights"
          />
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
