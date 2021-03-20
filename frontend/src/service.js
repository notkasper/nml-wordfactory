import request from 'superagent';
import authStore from './stores/auth';

const handleResponse = async (req) => {
  try {
    const response = await req;
    return response;
  } catch (error) {
    authStore.setError(
      `Er is iets mis gegaan: ${
        error.response.body.message ||
        error.response.body.error ||
        error.response.error ||
        'server error'
      }`
    );
    return null;
  }
};

const loadStudents = async (classId) => {
  const req = request.get(`/api/v1/students`).query({ classId });
  const response = await handleResponse(req);
  return response;
};

const loadClass = async (classId) => {
  const req = request.get(`/api/v1/classes/${classId}`);
  const response = await handleResponse(req);
  return response;
};

const loadCourses = async (classId) => {
  const req = request.get(`/api/v1/courses`).query({ classId });
  const response = await handleResponse(req);
  return response;
};

const loadClassList = async () => {
  const req = request.get('/api/v1/classes');
  const response = await handleResponse(req);
  return response;
};

const loadLessonAttempts = async (lessonId) => {
  const req = request.get(`/api/v1/lessonAttempts`).query({ lessonId });
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

export default {
  loadStudents,
  loadClass,
  loadCourses,
  loadClassList,
  loadLessonAttempts,
  login,
};
