import React, { useState, useEffect } from 'react';
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

const tabs = ['insights', 'questions'];
const mapTabToIndex = (tab) => tabs.indexOf(tab);
const mapIndexToTab = (index) => tabs[index];

const Lesson = (props) => {
  const { crumbs } = props;
  const history = useHistory();
  const params = useParams();
  const location = useLocation();
  const [value, setValue] = useState(mapTabToIndex(params.tab));

  const onClickTab = (event, tabIndex) => {
    const currentTab = params.tab;
    const newTab = mapIndexToTab(tabIndex);
    const newPath = location.pathname.replace(currentTab, newTab);
    history.push(newPath);
  };

  // for updating the current tab when the URL changes
  useEffect(() => {
    setValue(mapTabToIndex(params.tab));
  }, [params.tab]);

  return (
    <>
      <AppBar position="static">
        <Tabs value={value} onChange={onClickTab}>
          <Tab label="Inzicht (les)" icon={<EqualizerIcon />} />
          <Tab label="Opdrachten" icon={<EditIcon />} />
        </Tabs>
      </AppBar>

      <PageContainer maxWidth="lg">
        <Breadcrumbs crumbs={crumbs} />
        <TabContent index={0} value={value}>
          <Insights {...props} />
        </TabContent>
        <TabContent index={1} value={value}>
          <Questions {...props} />
        </TabContent>
      </PageContainer>
    </>
  );
};

export default observer(Lesson);
