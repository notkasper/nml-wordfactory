import React, { useEffect, useCallback } from 'react';
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
    const currentTab = params.questionGroupTab;
    const newPath = location.pathname.replace(currentTab, newTab);
    history.push(newPath);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={params.questionGroupTab} onChange={onClickTab}>
          <Tab
            label="Inzicht (opdracht)"
            icon={<EqualizerIcon />}
            value="question_group_insights"
          />
          <Tab
            label="Opdracht"
            icon={<VisibilityIcon />}
            value="question_group_questions"
          />
          <Tab
            label="Antwoorden"
            icon={<AssignmentTurnedInIcon />}
            value="question_group_answers"
          />
        </Tabs>
      </AppBar>
      <PageContainer maxWidth="lg">
        <Breadcrumbs crumbs={crumbs} />
        <TabContent
          index="question_group_questions"
          value={params.questionGroupTab}
        >
          <Question {...props} />
        </TabContent>
        <TabContent
          index="question_group_insights"
          value={params.questionGroupTab}
        >
          <Details {...props} />
        </TabContent>
        <TabContent
          index="question_group_answers"
          value={params.questionGroupTab}
        >
          <Answers {...props} />
        </TabContent>
      </PageContainer>
    </>
  );
};

export default QuestionStats;
