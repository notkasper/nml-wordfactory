import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
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

const Answers = (props) => {
  const { questionStore } = props;
  const type = questionStore.questionGroup.questions[0].type;
  switch (type) {
    case 'multipleChoice':
      return <AnswersMultipleChoice {...props} />;
    default:
      return (
        <p>{`Er is iets fout gegaan, ${type} wordt niet herkend als vraag type`}</p>
      );
  }
};

const QuestionStats = (props) => {
  const history = useHistory();
  const params = useParams();
  const location = useLocation();
  const { questionStore, crumbs } = props;

  const loadAll = useCallback(async () => {
    await questionStore.loadQuestionGroupWithAttempts(params.questionGroupId);
  }, [questionStore, params.questionGroupId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onClickTab = (event, newTab) => {
    const currentTab = params.tab;
    const newPath = location.pathname.replace(currentTab, newTab);
    history.push(newPath);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={params.tab} onChange={onClickTab}>
          <Tab
            label="Inzicht (opdracht)"
            icon={<EqualizerIcon />}
            value="insights"
          />
          <Tab label="Opdracht" icon={<VisibilityIcon />} value="questions" />
          <Tab
            label="Antwoorden"
            icon={<AssignmentTurnedInIcon />}
            value="answers"
          />
        </Tabs>
      </AppBar>
      <PageContainer maxWidth="lg">
        <Breadcrumbs crumbs={crumbs} />
        <TabContent index="questions" value={params.tab}>
          <Question {...props} />
        </TabContent>
        <TabContent index="insights" value={params.tab}>
          <Details {...props} />
        </TabContent>
        <TabContent index="answers" value={params.tab}>
          <Answers {...props} />
        </TabContent>
      </PageContainer>
    </>
  );
};

export default QuestionStats;
