import _ from 'lodash';
import { action, makeObservable, observable, computed } from 'mobx';

import service from '../service';

class StudentStore {
  constructor() {
    makeObservable(this, {
      topResults: observable,
      students: observable,
      bottomResults: observable,
      loadStudents: action,
      setTopResults: action,
      setBottomResults: action,
      popLoad: action,
      pushLoad: action,
      isLoading: computed,
    });
  }

  students = null;
  topResults = [];
  bottomResults = [];

  popLoad = () => (this.loading -= 1);

  pushLoad = () => (this.loading += 1);

  setTopResults = (topResults) => (this.topResults = topResults);

  setBottomResults = (bottomResults) => (this.bottomResults = bottomResults);

  loadStudents = async (classId) => {
    this.pushLoad();
    const response = await service.loadStudents(classId);
    if (response) {
      this.students = response.body.data;
    }

    const distribution = this.computeDistribution(this.students).sort(
      (a, b) => a.correctness - b.correctness
    );

    const cutoffValue = Math.round(distribution.length * 0.25);
    const bottomResults = distribution.slice(0, cutoffValue);
    const topResults = distribution.slice(
      Math.max(distribution.length - cutoffValue, 0)
    );

    this.setBottomResults(bottomResults);
    this.setTopResults(topResults);
    this.updateBottomStudents(bottomResults);
    this.popLoad();
  };

  computeDistribution = (students) => {
    const distribution = [];

    students.forEach((student) => {
      let total = { correct: 0, incorrect: 0, missed: 0 };
      student.lessonAttempts.forEach((lessonAttempt) => {
        const currentTotal = lessonAttempt.questionGroupAttempts.reduce(
          (acc, curr) => ({
            correct: acc.correct + curr.correct,
            incorrect: acc.incorrect + curr.incorrect,
            missed: acc.missed + curr.missed,
          }),
          { correct: 0, incorrect: 0, missed: 0 }
        );

        total = _.mergeWith({}, total, currentTotal, (obj1, obj2) =>
          _.isNumber(obj1) ? obj1 + obj2 : obj2
        );
      });

      const totalPoints = total.correct + total.incorrect + total.missed;
      const ratio = total.correct / totalPoints;
      distribution.push({
        name: student.name,
        id: student.id,
        correctness: Math.round((ratio || 0) * 100),
      });
    });

    return distribution;
  };

  updateBottomStudents = (bottomResults) => {
    this.students = this.students
      .map((student) => ({
        ...student,
        bottom: bottomResults.some((info) => student.id === info.id),
      }))
      .sort((a, b) => b.bottom - a.bottom);
  };

  get isLoading() {
    return this.loading > 0;
  }
}

export default new StudentStore();
