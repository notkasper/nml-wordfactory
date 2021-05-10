import request from 'superagent';
import authStore from './stores/auth';

const handleResponse = async (req) => {
  try {
    const response = await req;
    return response;
  } catch (error) {
    authStore.setError(
      `Er is iets mis gegaan: ${
        error.response.body?.message ||
        error.response.body?.error ||
        error.response.error ||
        'server error'
      }`
    );
    return null;
  }
};

const loadStudents = async (query) => {
  const req = request.get(`/api/v1/students`).query(query);
  const response = await handleResponse(req);
  return response;
};

const loadClass = async (classId) => {
  const req = request.get(`/api/v1/classes/${classId}`);
  const response = await handleResponse(req);
  return response;
};

const loadCourses = async (query) => {
  const req = request.get(`/api/v1/courses`).query(query);
  const response = await handleResponse(req);
  return response;
};

const loadClasses = async () => {
  const req = request.get('/api/v1/classes');
  const response = await handleResponse(req);
  return response;
};

const loadLessonAttempts = async (lessonId) => {
  const req = request.get(`/api/v1/lessonAttempts`).query({ lessonId });
  const response = await handleResponse(req);
  return response;
};

const loadLesson = async (lessonId) => {
  const req = request.get(`/api/v1/lessons/${lessonId}`);
  const response = await handleResponse(req);
  return response;
};

const login = async (email, password) => {
  const req = request.post('/api/v1/auth/login').send({
    email,
    password,
  });
  const response = await handleResponse(req);
  return response;
};

const loadStudent = async (id) => {
  const req = request.get(`/api/v1/students/${id}`);
  const response = await handleResponse(req);
  return response;
};

const loadAllQuestionGroupAttempts = async () => {
  const req = request
    .get(`/api/v1/questionGroupAttempts`)
    .query({ pageSize: 10 });
  const response = await handleResponse(req);
  return response;
};

const loadQuestionGroupAttempts = async (id) => {
  const req = request.get(
    `/api/v1/questionGroupAttempts/questionGroupId/${id}`
  );
  const response = await handleResponse(req);
  return response;
};

const loadQuestionGroup = async (id) => {
  const req = request.get(`/api/v1/questionGroup/${id}`);
  const response = await handleResponse(req);
  return response;
};

const updateQuestion = async (id, data) => {
  const req = request.patch(`/api/v1/question/${id}`).send({ data });
  const response = await handleResponse(req);
  return response;
};

const service = {
  loadStudents,
  loadStudent,
  loadClass,
  loadCourses,
  loadClasses,
  loadLessonAttempts,
  loadLesson,
  login,
  loadAllQuestionGroupAttempts,
  loadQuestionGroupAttempts,
  loadQuestionGroup,
  updateQuestion,
};

export default service;
