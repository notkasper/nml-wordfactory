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
    name: 'Home',
  },
  {
    exact: true,
    path: '/dashboard/profile',
    Component: Profile,
    name: 'Profile',
  },
  {
    exact: true,
    path: '/dashboard/classes/:classId/:classTab',
    Component: Class,
    name: 'Klas',
  },
  {
    exact: true,
    path: '/dashboard/classes/:classId/:classTab/lessons/:lessonId/:lessonTab',
    Component: Lesson,
    name: 'Les',
  },
  {
    exact: true,
    path: '/dashboard/students/:studentId',
    Component: Student,
    name: 'Leerling',
  },
  {
    exact: true,
    path: '/dashboard/students/:studentId/lessons/:lessonId',
    Component: StudentLesson,
    name: 'Les Inzicht',
  },
  {
    exact: true,
    path: '/dashboard/classes/:classId/:classTab/lessons/:lessonId/:lessonTab/questionGroups/:questionGroupId/:questionGroupTab',
    Component: QuestionGroup,
    name: 'Opdracht',
  },
  {
    exact: true,
    path: '/dashboard/students',
    Component: Students,
    name: 'Leerlingen',
  },
];

export default routes;
