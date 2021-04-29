import React, { useState } from 'react';
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
  const [value, setValue] = useState('insights');

  const onChangeTab = (event, newValue) => {
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
        </Tabs>
      </AppBar>
      <PageContainer maxWidth="lg">
        <Breadcrumbs crumbs={crumbs} />
        <TabContent index="insights" value={value}>
          <Insights {...props} />
        </TabContent>
        <TabContent index="questions" value={value}>
          <Questions {...props} />
        </TabContent>
      </PageContainer>
    </>
  );
};

export default observer(Lesson);
