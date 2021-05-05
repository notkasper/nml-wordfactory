import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import Details from './Insights';
import Question from './Question';
import TabContent from '../_shared/TabContent';
import Breadcrumbs from '../_shared/Breadcrumbs';
import PageContainer from '../_shared/PageContainer';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import AnswersMultipleChoice from './AnswersMultipleChoice';

const QuestionStats = (props) => {
  const { crumbs } = props;
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
          <Tab
            label="Antwoorden"
            icon={<AssignmentTurnedInIcon />}
            value="answers"
          />
        </Tabs>
      </AppBar>
      <PageContainer maxWidth="lg">
        <Breadcrumbs crumbs={crumbs} />
        <TabContent index="question" value={value}>
          <Question {...props} />
        </TabContent>
        <TabContent index="insights" value={value}>
          <Details {...props} />
        </TabContent>
        <TabContent index="answers" value={value}>
          <AnswersMultipleChoice {...props} />
        </TabContent>
      </PageContainer>
    </>
  );
};

export default QuestionStats;
