// PAGES
import LessonView from './pages/home';
import Profile from './pages/profile';
import Class from './pages/class';
import Lesson from './pages/lesson';
import Student from './pages/student';
import StudentLesson from './pages/studentLesson';
import QuestionGroup from './pages/questionGroup';
import Students from './pages/students';

const routes = [
  {
    exact: true,
    path: '/dashboard/home',
    Component: LessonView,
    name: 'home',
  },
  {
    exact: true,
    path: '/dashboard/profile',
    Component: Profile,
    name: 'profile',
  },
  {
    exact: true,
    path: '/dashboard/classes/:classId',
    Component: Class,
    name: 'klas',
  },
  {
    exact: true,
    path: '/dashboard/classes/:classId/lessons/:lessonId',
    Component: Lesson,
    name: 'les',
  },
  {
    exact: true,
    path: '/dashboard/students/:studentId',
    Component: Student,
    name: 'leerling',
  },
  {
    exact: true,
    path: '/dashboard/students/:studentId/lessons/:lessonId',
    Component: StudentLesson,
    name: 'les inzicht',
  },
  {
    exact: true,
    path: '/dashboard/questionGroups/:questionGroupId',
    Component: QuestionGroup,
    name: 'vraag groep',
  },
  {
    exact: true,
    path: '/dashboard/students',
    Component: Students,
    name: 'leerlingen',
  },
];

export default routes;
