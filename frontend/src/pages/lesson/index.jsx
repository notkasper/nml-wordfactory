import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import EditIcon from '@material-ui/icons/Edit';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import { observer } from 'mobx-react-lite';
import Insights from './Insights';
import Questions from './LessonContent';
import QuestionGroupAttempt from './QuestionGroupAttempt';
import TabContent from '../_shared/TabContent';

const Lesson = (props) => {
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
          <Tab
            label="Inzicht (les)"
            icon={<EqualizerIcon />}
            value="insights"
          />
          <Tab label="Opdrachten" icon={<EditIcon />} value="questions" />
          <Tab
            label="Antwoorden"
            icon={<AssignmentTurnedInIcon />}
            value="questionGroupAttempt"
          />
        </Tabs>
      </AppBar>
      <TabContent index="insights" value={value}>
        <Insights {...props} />
      </TabContent>
      <TabContent index="questions" value={value}>
        <Questions {...props} />
      </TabContent>
      <TabContent index="questionGroupAttempt" value={value}>
        <QuestionGroupAttempt />
      </TabContent>
    </>
  );
};

export default observer(Lesson);
