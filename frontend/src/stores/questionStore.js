import { convertGridRowsPropToState } from '@material-ui/data-grid';
import { action, makeObservable, observable, computed } from 'mobx';
//import { ObservableObjectAdministration } from 'mobx/dist/internal';
//import { ObservableValue } from 'mobx/dist/internal';
import service from '../service';
import utils from './_utils';

// Tutorial on mobx state management: https://blog.logrocket.com/introduction-to-mobx-with-react/
class QuestionStore {
  constructor() {
    makeObservable(this, {
      questionGroup: observable,
      questionAttempts: observable,
      questionGroupAttempts: observable,
      questionGroupWithAttempts: observable,
      //loadQuestionGroup: action,
      //lessonAttempts: observable,
      //loadLessonAttempts: action,
      // loadQuestionGroupWithAttempts: action,
      //loadStudents: action,
      students: observable,
      //loadQuestionGroupAttempts: action,
      setQuestionGroup: action,
      setLoading: action,
      loading: observable,
      popLoad: action,
      pushLoad: action,
      setNumber: action,
      setQuestionAttempts: action,
      setlessonAttempts: action,
      setQuestionGroupAttempts: action,
      setQuestionGroupWithAttempts: action,
      setStudents: action,
      setQuestionAttemptsGroupId: action,
      questionAttemptsGroupId: observable,
      isLoading: computed,
    });
  }

  questionGroup = null;
  questionAttempts = [];
  questionGroupAttempts = [];
  questionAttemptsGroupId = [];
  lessonAttempts = [];
  questionGroupWithAttempts = null;
  students = [];
  loading = 0;
  setNumber = (number) => (this.number = number);
  setQuestionGroup = (questionGroup) => (this.questionGroup = questionGroup);
  setLoading = (loading) => (this.loading = loading);
  setQuestionAttempts = (questionAttempts) =>
    (this.questionAttempts = questionAttempts);
  setQuestionGroupAttempts = (questionGroupAttempts) =>
    (this.questionGroupAttempts = questionGroupAttempts);
  setlessonAttempts = (lessonAttempts) =>
    (this.lessonAttempts = lessonAttempts);
  setStudents = (students) => (this.students = students);
  setQuestionAttemptsGroupId = (questionAttemptGroupsId) =>
    (this.questionAttemptGroupsId = questionAttemptGroupsId);
  setQuestionGroupWithAttempts = (questionGroupWithAttempts) =>
    (this.questionGroupWithAttempts = questionGroupWithAttempts);

  popLoad = () => (this.loading -= 1);
  pushLoad = () => (this.loading += 1);

  // loadStudents = async (classId) => {
  //   if (this.student?.classId === classId) {
  //     return;
  //   }
  //   const response = await service.loadStudents(classId);
  //   if (!response) {
  //     return;
  //   }
  //   this.setStudents(response.body.data);
  // };
  // loadQuestionGroupAttempts = async (questionGroupId) => {
  //   this.pushLoad();
  //   if (this.questionGroupAttempts?.id === questionGroupId) {
  //     return;
  //   }
  //   const response = await service.loadQuestionGroupAttempts(questionGroupId);
  //   if (!response) {
  //     return;
  //   }
  //   this.setQuestionGroupAttempts(response.body.data);
  //   console.log(this.questionGroupAttempts);
  //   this.popLoad();
  // };

  // loadLessonAttempts = async (lessonId) => {
  //   if (
  //     this.lessonAttempts?.length &&
  //     this.lessonAttempts[0]?.lessonId === lessonId
  //   ) {
  //     return;
  //   }

  //   const response = await service.loadLessonAttempts(lessonId);
  //   if (!response) {
  //     return;
  //   }
  //   this.setlessonAttempts(response.body.data);
  // };

  loadQuestionGroupWithAttempts = async (
    questionGroupId,
    lessonId,
    classId
  ) => {
    this.pushLoad();

    //Load Students
    if (this.student?.classId === classId) {
      return;
    }

    const responseS = await service.loadStudents(classId);
    if (!responseS) {
      return;
    }
    this.setStudents(responseS.body.data);

    //Load LessonAttempts
    if (
      this.lessonAttempts?.length &&
      this.lessonAttempts[0]?.lessonId === lessonId
    ) {
      return;
    }

    const responseLA = await service.loadLessonAttempts(lessonId);
    if (!responseLA) {
      return;
    }
    this.setlessonAttempts(responseLA.body.data);

    //LoadQuestionGroupAttempts
    if (this.questionGroupAttempts?.id === questionGroupId) {
      return;
    }
    const responseQGA = await service.loadQuestionGroupAttempts(
      questionGroupId
    );
    if (!responseQGA) {
      return;
    }
    this.setQuestionGroupAttempts(responseQGA.body.data);

    //LoadQuestionGroup
    const responseQG = await service.loadQuestionGroup(questionGroupId);
    if (!responseQG) {
      return;
    }

    let questionGroup = utils.addQuestionGroupAttemptStats(
      responseQG.body.data,
      this.questionGroupAttempts
    );
    questionGroup = utils.addQuestionGroupStats(responseQG.body.data);

    //Store questionGroupAttemptsIds
    let questionGroupAttemptsIds = [];
    this.questionGroupAttempts.map((questionGroupAttempt) => {
      questionGroupAttemptsIds.push(questionGroupAttempt.id);
    });
    //Store questionGroupName
    const questionGroupName = questionGroup.name;
    //Store lesstenAttemptsIds
    let lessonAttemptsIds = [];
    this.questionGroupAttempts.map((lessonAttemptId) => {
      lessonAttemptsIds.push(lessonAttemptId.lessonAttemptId);
    });

    //Store questions
    let questions = [];
    questionGroup.questions.map((question) => {
      questions.push(question);
    });

    //Load questionAttempts based on questionId
    const getQA = async (questionId) => {
      return service.loadQuestionAttemptsID(questionId);
    };
    const QAIdData = async () => {
      return Promise.all(questions.map((question) => getQA(question.id)));
    };

    let questionAttemptsID = [];
    let questionAttemptsIDAdded = [];
    QAIdData().then((data) => {
      data.map((promise) => questionAttemptsID.push(promise.body.data));
      questionAttemptsID = questionAttemptsID.flat();
      questionAttemptsID.map((questionAttemptID) => {
        let addedQA = utils.addquestionAttemptInformation(
          questionAttemptID,
          this.questionGroupAttempts,
          questions,
          this.lessonAttempts,
          this.students,
          questionGroupName
        );
        addedQA.content = questionAttemptID.content;
        addedQA.answer =
          questionAttemptID.question.data.options[questionAttemptID.content];
        addedQA.id = questionAttemptID.id;
        questionAttemptsIDAdded.push(addedQA);
      });

      this.setQuestionAttemptsGroupId(questionAttemptsIDAdded);
      questionGroup.questionAttempts = questionAttemptsIDAdded;
      this.setQuestionGroupWithAttempts(questionGroup);
      console.log(questionGroup);
      questionGroup = utils.addQuestionAttemptsStats(questionGroup);
      console.log(this.questionGroupWithAttempts);
      this.popLoad();
    });
  };

  // loadQuestionGroup = async (questionGroupId) => {
  //   this.pushLoad();

  //   this.pushLoad();

  //   this.loadQuestionAttemptsGroupId(questionGroupId);
  //   this.popLoad();

  //   console.log(this.loading);
  //   console.log(this.questionAttemptGroupsId);

  //   if (this.questionGroup?.id === questionGroupId) {
  //     return;
  //   }
  //   console.log(questionGroupId);
  //   const responseQA = await service.loadQuestionGroupAttempts(questionGroupId);
  //   if (!responseQA) {
  //     return;
  //   }
  //   const responseQG = await service.loadQuestionGroup(questionGroupId);
  //   if (!responseQG) {
  //     return;
  //   }
  //   let questionGroup = utils.addQuestionGroupAttemptStats(
  //     responseQG.body.data,
  //     responseQA.body.data
  //   );
  //   questionGroup = utils.addQuestionGroupStats(
  //     responseQG.body.data,
  //     this.questionAttemptGroupsId
  //   );
  //   this.setQuestionGroup(questionGroup);
  //   this.popLoad();
  // };

  get isLoading() {
    console.log(this.loading);
    return this.loading > 0;
  }
}

export default new QuestionStore();
