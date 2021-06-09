import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react-lite';
import Activity from './Activity';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import PercentageDoughnut from '../_shared/PercentageDoughnut';
import service from '../../service';
import PaperWithHeader from '../_shared/PaperWithHeader';
import ProgressBar from '../_shared/ProgressBar';

const useStyles = makeStyles((theme) => ({
  widget: {
    padding: theme.spacing(3),
  },
  paper: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    height: 230,
    padding: theme.spacing(3),
  },
}));

const convertCategoryToString = (category) => {
  const conversion = {
    learning_process: 'Leerproces',
    recognizing_morphemes_sentence: 'Herkennen morfemen in een zin',
    meaning_morphemes: 'Betekenis morfemen',
    splitsing_morphemes: 'Splits morfemen',
    create_morphemes_prefix: 'Creëren morfemen (voorvoegsel)',
    background_morphemes: 'Alternatieve betekenis morfemen',
    recognizing_morphemes_text: 'Herkennen morfemen in een tekst',
    intuition: 'Intuïtie',
    create_alternative_morphemes: 'Creëren alternatieve morfemen',
    create_morphemes_suffix: 'Creëren morfemen (achtervoegsel)',
    create_new_morphemes: 'Creëren nieuwe morfemen',
  };

  return conversion[category];
};

const InsightsDuring = (props) => {
  const { lessonId, classId, questionStore, studentStore } = props;
  const theme = useTheme();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  let ratioCorrect = 0;
  let ratioProgress = 0;

  const getAverageValues = () => {
    let totalCorrect = 0;
    let totalNotComplete = 0;
    let totalComplete = 0;
    let totalScores = 0;
    let elapsedTimes = [];

    if (questionStore.questionGroups) {
      questionStore.questionGroups.forEach((qg) => {
        qg.questionGroupAttempts.forEach((qga) => {
          if (qga.lessonAttempt.lessonId === lessonId) {
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
      });

      ratioCorrect = Math.round((totalCorrect / totalScores) * 100);
      ratioProgress = Math.round(
        (totalComplete / (totalComplete + totalNotComplete)) * 100
      );
    }
  };

  const loadLessonCategories = useCallback(async () => {
    const response = await service.loadLessonCategories(classId);
    if (!response) return;
    setCategories(response.body.data);
  }, [classId]);

  const loadStudents = useCallback(async () => {
    await studentStore.loadStudents({ classId });
  }, [studentStore, classId]);

  const loadQuestionGroups = useCallback(async () => {
    await questionStore.loadQuestionGroupsByLessonId(lessonId);
  }, [questionStore, lessonId]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const promises = [
      loadStudents(),
      loadQuestionGroups(),
      loadLessonCategories(),
    ];
    await Promise.all(promises);
    setLoading(false);
  }, [loadStudents, loadQuestionGroups, loadLessonCategories]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (questionStore.isLoading || loading) {
    return <CircularProgress />;
  }

  getAverageValues();

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
      <Grid container spacing={3} className={classes.widget}>
        <PaperWithHeader
          headercolor={theme.widget.secondary.main}
          headertitle="Topcategorieën"
        >
          <Paper className={classes.paper}>
            {categories.slice(0, 3).map((category, index) => (
              <ProgressBar
                key={category.key}
                title={`${index + 1}. ${convertCategoryToString(category.key)}`}
                value={category.correctness}
              />
            ))}
          </Paper>
        </PaperWithHeader>
        <PaperWithHeader
          headercolor={theme.widget.secondary.main}
          headertitle="Probleemcategorieën"
        >
          <Paper className={classes.paper}>
            {categories.slice(-3).map((category, index) => (
              <ProgressBar
                key={category.key}
                title={`${index + 1}. ${convertCategoryToString(category.key)}`}
                value={category.correctness}
              />
            ))}
          </Paper>
        </PaperWithHeader>
      </Grid>
      <Grid item xs={12}>
        <Paper>{getContent()}</Paper>
      </Grid>
    </Grid>
  );
};

export default observer(InsightsDuring);
