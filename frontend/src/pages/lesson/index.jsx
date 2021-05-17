import React from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import EditIcon from '@material-ui/icons/Edit';
import { observer } from 'mobx-react-lite';
import Insights from './Insights';
import Questions from './LessonContent';
import TabContent from '../_shared/TabContent';
import Breadcrumbs from '../_shared/Breadcrumbs';
import PageContainer from '../_shared/PageContainer';

const Lesson = (props) => {
  const { crumbs } = props;
  const history = useHistory();
  const params = useParams();
  const location = useLocation();

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
            label="Inzicht (les)"
            value="insights"
            icon={<EqualizerIcon />}
          />
          <Tab label="Opdrachten" value="questions" icon={<EditIcon />} />
        </Tabs>
      </AppBar>

      <PageContainer maxWidth="lg">
        <Breadcrumbs crumbs={crumbs} />
        <TabContent index="insights" value={params.tab}>
          <Insights {...props} />
        </TabContent>
        <TabContent index="questions" value={params.tab}>
          <Questions {...props} />
        </TabContent>
      </PageContainer>
    </>
  );
};

export default observer(Lesson);
