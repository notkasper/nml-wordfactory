import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PieChartIcon from '@material-ui/icons/PieChart';
import EditIcon from '@material-ui/icons/Edit';
import { observer } from 'mobx-react-lite';
import Insights from './Insights';
import Questions from './LessonContent';
import TabContent from '../_shared/TabContent';

const useStyles = makeStyles((theme) => ({}));

const Lesson = (props) => {
  const params = useParams();
  const history = useHistory();
  const [value, setValue] = useState(params.tab);

  const onChangeTab = (event, newValue) => {
    console.log(newValue);
    history.push(newValue);
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={value} onChange={onChangeTab}>
          <Tab label="Inzichten" icon={<PieChartIcon />} value="insights" />
          <Tab label="Opdrachten" icon={<EditIcon />} value="questions" />
        </Tabs>
      </AppBar>
      <TabContent index="insights" value={value}>
        <Insights {...props} />
      </TabContent>
      <TabContent index="questions" value={value}>
        <Questions {...props} />
      </TabContent>
    </>
  );
};

export default observer(Lesson);
