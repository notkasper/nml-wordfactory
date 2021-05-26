import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Activity from './Activity';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import PercentageDoughnut from '../_shared/PercentageDoughnut';
import { connect } from 'superagent';
import { Timeline } from '@material-ui/lab';

const InsightsDuring = (props) => {
  const { questionGroupIds, lessonId, questionStore } = props;
  const math = require('mathjs');
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  let ratioCorrect = 0;
  let ratioProgress = 0;
  let averageTime = 0;
  const history = useHistory();

  const loadAll = useCallback(async () => {
    setLoading(true);
    await questionStore.loadQuestionGroupsWithAttempts(questionGroupIds);
    setLoading(false);
  }, [questionStore, questionGroupIds]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (questionStore.isLoading || loading) {
    return <CircularProgress />;
  }

  const getAverageValues = () => {
    let totalCorrect = 0;
    let totalNotComplete = 0;
    let totalComplete = 0;
    let totalScores = 0;
    let totalTime = 0;
    let acc = 0;
    let elapsedTimes = [];

    if (questionStore.questionGroups) {
      questionStore.questionGroups.forEach((qg) => {
        if (qg.questions[0].type === 'multipleChoice') {
          qg.questionGroupAttempts.forEach((qga) => {
            if (qga.lessonAttempts.lessonId === lessonId) {
              if (qga.isCompleted) {
                totalComplete += 1;
                totalCorrect += qga.correct;
                totalScores += qga.correct + qga.incorrect + qga.missed;
                elapsedTimes.push(qga.timeElapsedSeconds);
              } else {
                totalNotComplete += 1;
              }
            }
          });
        }
      });

      ratioCorrect = Math.round((totalCorrect / totalScores) * 100);
      ratioProgress = Math.round(
        (totalComplete / (totalComplete + totalNotComplete)) * 100
      );

      const sortedTimes = elapsedTimes.sort((a, b) => a - b);
      const median = math.median(sortedTimes);
      const std = math.std(sortedTimes);
      const rangeMin = median - std;
      const rangeMax = median + std;
      for (const time in sortedTimes) {
        if (time >= rangeMin && time <= rangeMax) {
          totalTime += parseInt(time);
          acc += 1;
        }
      }
      averageTime = totalTime / acc;
    }
  };

  const convertToMinutes = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min. ${seconds} sec.`;
  };

  const calculateRGB = (percentage) => {
    const shade = 0.8;
    const color = Math.floor(
      (percentage <= 50 ? percentage / 50 : (100 - percentage) / 50) * 255
    );
    const rgb = (percentage <= 50 ? [255, color, 0] : [color, 255, 0]).map(
      (color) => Math.round(color * shade)
    );
    return `rgb(${rgb.join(',')})`;
  };

  const getDoughnutData = (ratio) => {
    return {
      datasets: [
        {
          data: [100 - ratio, ratio],
          backgroundColor: ['rgb(0, 0, 0, 0)', calculateRGB(ratio)],
        },
      ],
    };
  };

  const getContent = () => {
    return questionStore.questionGroups ? (
      <Activity
        questionGroups={questionStore.questionGroups}
        lessonId={lessonId}
        {...props}
      />
    ) : null;
  };

  const options = ({ color, text }) => ({
    cutoutPercentage: 75,
    tooltips: { enabled: false },
    hover: { mode: null },
    responsive: true,
    elements: {
      center: {
        text,
        color: color || '#FFFFFF',
      },
    },
  });

  getAverageValues();
  return (
    <Grid container spacing={3}>
      {/* Average percentage statistics */}
      <PercentageDoughnut
        title="Gemiddelde correctheid"
        data={getDoughnutData(ratioCorrect)}
        options={options({
          color: 'black',
          text: String(ratioCorrect) + '%',
        })}
      />
      <PercentageDoughnut
        title="Gemiddelde voortgang"
        data={getDoughnutData(ratioProgress)}
        options={options({
          color: 'black',
          text: String(ratioProgress) + '%',
        })}
        titleColor={theme.widget.secondary.main}
      />
      <PercentageDoughnut
        title="Gemiddelde tijdsduur"
        data={getDoughnutData({
          averageTime,
        })}
        options={options({
          color: 'black',
          text: convertToMinutes(averageTime),
        })}
        titleColor={theme.widget.tertiary.main}
      />
      <Grid item xs={12}>
        <Paper>{getContent()}</Paper>
      </Grid>
    </Grid>
  );
};

export default observer(InsightsDuring);
