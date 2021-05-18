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

    const studentsResults = this.computeDistribution(this.students);
    const topResults = this.computeTopBottom(
      studentsResults[0],
      studentsResults[1],
      'top',
      null
    );
    const bottomResults = this.computeTopBottom(
      studentsResults[0],
      studentsResults[2],
      'bottom',
      response.body.data
    );
    this.setTopResults(topResults);
    this.setBottomResults(bottomResults);

    this.popLoad();
  };

  computeDistribution = (students) => {
    let studentsCorrect = Array(students.length).fill(0);
    const studentsInfo = [];
    let studentsIncorrect = Array(students.length).fill(0);
    let total = 0;

    students.forEach((student, index) => {
      studentsInfo.push({ name: student.name, id: student.id });
      student.lessonAttempts.forEach((lessonAtempt) => {
        lessonAtempt.questionGroupAttempts.forEach(
          (questionGroupAttempt, index) => {
            if (
              !(
                questionGroupAttempt.correct === 0 &&
                questionGroupAttempt.incorrect === 0 &&
                questionGroupAttempt.missed === 0
              ) &&
              questionGroupAttempt.isCompleted
            ) {
              total +=
                questionGroupAttempt.correct +
                questionGroupAttempt.incorrect +
                questionGroupAttempt.missed;
              studentsCorrect[index] += Math.round(
                (questionGroupAttempt.correct / total) * 100
              );
              studentsIncorrect[index] +=
                (questionGroupAttempt.incorrect + questionGroupAttempt.missed) /
                total;
            }
          }
        );
      });
    });
    return [studentsInfo, studentsCorrect, studentsIncorrect];
  };

  computeTopBottom = (studentsInfo, distribution, category, students) => {
    const sortedDistribution = distribution.sort();
    const amount = Math.round(sortedDistribution.length * 0.25);
    const slicedDistribution = [];
    const slicedStudentInfo = [];
    if (category === 'top') {
      for (
        let i = sortedDistribution.length - amount;
        i < sortedDistribution.length;
        i++
      ) {
        slicedDistribution.push(sortedDistribution[i]);
        slicedStudentInfo.push(studentsInfo[i]);
      }
      return [slicedDistribution, slicedStudentInfo];
    }

    for (let i = 0; i < amount; i++) {
      slicedDistribution.push(sortedDistribution[i]);
      slicedStudentInfo.push(studentsInfo[i]);
    }
    this.updateBottomStudents(students, slicedStudentInfo);

    return [slicedDistribution, slicedStudentInfo];
  };

  updateBottomStudents = (students, studentsInfo) => {
    students.forEach((student) => {
      studentsInfo.forEach((info) => {
        if (student.id === info.id) {
          student.bottom = true;
        }
      });
      if (!student.bottom) {
        student.bottom = false;
      }
    });
    this.students = students;
  };

  get isLoading() {
    return this.loading > 0;
  }
}

export default new StudentStore();
