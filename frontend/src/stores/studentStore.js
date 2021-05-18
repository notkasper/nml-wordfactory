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

    const [studentsInfo, distribution] = this.computeDistribution(
      this.students
    );
    const topResults = this.computeTop(
      studentsInfo,
      distribution.sort(),
      Math.round(distribution.length * 0.25)
    );
    const bottomResults = this.computeBottom(
      studentsInfo,
      distribution.sort(),
      Math.round(distribution.length * 0.25),
      response.body.data
    );
    this.setTopResults(topResults);
    this.setBottomResults(bottomResults);

    this.popLoad();
  };

  computeDistribution = (students) => {
    const studentsCorrect = Array(students.length).fill(0);
    const studentsInfo = [];
    const studentsIncorrect = Array(students.length).fill(0);
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

  computeTop = (studentsInfo, distribution, cutoffValue) => {
    const slicedDistribution = distribution.slice(
      distribution.length - cutoffValue,
      distribution.length
    );
    const slicedStudentInfo = studentsInfo.slice(
      studentsInfo.length - cutoffValue,
      studentsInfo.length
    );

    return [slicedDistribution, slicedStudentInfo];
  };

  computeBottom = (studentsInfo, distribution, cutoffValue, students) => {
    const slicedDistribution = distribution.slice(0, cutoffValue);
    const slicedStudentInfo = studentsInfo.slice(0, cutoffValue);
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
